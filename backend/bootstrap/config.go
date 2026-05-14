package bootstrap

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	MinIO    MinIOConfig    `mapstructure:"minio"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	ML       ServiceURL     `mapstructure:"ml_service"`
	Events   ServiceURL     `mapstructure:"event_collector"`
	Seed     SeedConfig     `mapstructure:"seed"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
	Env  string `mapstructure:"env"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Name     string `mapstructure:"name"`
	SSLMode  string `mapstructure:"sslmode"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	Password string `mapstructure:"password"`
}

type MinIOConfig struct {
	Endpoint  string `mapstructure:"endpoint"`
	AccessKey string `mapstructure:"access_key"`
	SecretKey string `mapstructure:"secret_key"`
	Bucket    string `mapstructure:"bucket"`
	UseSSL    bool   `mapstructure:"use_ssl"`
}

type JWTConfig struct {
	Secret             string `mapstructure:"secret"`
	AccessExpireHours  int    `mapstructure:"access_expire_hours"`
	RefreshExpireDays  int    `mapstructure:"refresh_expire_days"`
}

type ServiceURL struct {
	URL string `mapstructure:"url"`
}

type SeedConfig struct {
	Enabled bool `mapstructure:"enabled"`
}

func LoadConfig() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AddConfigPath("./backend")

	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// ENV overrides for secrets
	_ = v.BindEnv("database.password", "DATABASE_PASSWORD")
	_ = v.BindEnv("jwt.secret", "JWT_SECRET")
	_ = v.BindEnv("minio.access_key", "MINIO_ACCESSKEY")
	_ = v.BindEnv("minio.secret_key", "MINIO_SECRETKEY")

	if err := v.ReadInConfig(); err != nil {
		return nil, err
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
