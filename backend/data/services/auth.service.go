package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sk/shopai/backend/bootstrap"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	users *repositories.UserRepository
	cfg   bootstrap.JWTConfig
}

func NewAuthService(u *repositories.UserRepository, cfg bootstrap.JWTConfig) *AuthService {
	return &AuthService{u, cfg}
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.AuthResponse, error) {
	if req.Email == "" || req.Password == "" || req.Name == "" {
		return nil, errors.New("missing required fields")
	}
	if _, err := s.users.FindByEmail(req.Email); err == nil {
		return nil, errors.New("email already registered")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	u := &entities.User{
		Name: req.Name, Email: req.Email, Phone: req.Phone,
		PasswordHash: string(hash), Role: "buyer",
	}
	if err := s.users.Create(u); err != nil {
		return nil, err
	}
	return s.tokens(u)
}

func (s *AuthService) Login(req models.LoginRequest) (*models.AuthResponse, error) {
	u, err := s.users.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}
	return s.tokens(u)
}

func (s *AuthService) BecomeSeller(userID uint) (*entities.User, error) {
	u, err := s.users.FindByID(userID)
	if err != nil {
		return nil, err
	}
	u.Role = "seller"
	u.IsSeller = true
	if err := s.users.Save(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *AuthService) tokens(u *entities.User) (*models.AuthResponse, error) {
	access, err := s.sign(u, time.Hour*time.Duration(s.cfg.AccessExpireHours))
	if err != nil {
		return nil, err
	}
	refresh, err := s.sign(u, time.Hour*24*time.Duration(s.cfg.RefreshExpireDays))
	if err != nil {
		return nil, err
	}
	return &models.AuthResponse{
		AccessToken:  access,
		RefreshToken: refresh,
		User: models.UserDTO{
			ID: u.ID, Name: u.Name, Email: u.Email, Role: u.Role,
			Avatar: u.Avatar, Phone: u.Phone, IsSeller: u.IsSeller,
		},
	}, nil
}

func (s *AuthService) sign(u *entities.User, ttl time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"sub":  u.ID,
		"role": u.Role,
		"exp":  time.Now().Add(ttl).Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(s.cfg.Secret))
}

func (s *AuthService) Parse(tokenStr string) (uint, string, error) {
	tok, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.cfg.Secret), nil
	})
	if err != nil || !tok.Valid {
		return 0, "", errors.New("invalid token")
	}
	claims, ok := tok.Claims.(jwt.MapClaims)
	if !ok {
		return 0, "", errors.New("invalid claims")
	}
	sub, _ := claims["sub"].(float64)
	role, _ := claims["role"].(string)
	return uint(sub), role, nil
}
