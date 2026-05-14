package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/sk/shopai/backend/api/controllers"
	"github.com/sk/shopai/backend/api/routes"
	"github.com/sk/shopai/backend/bootstrap"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/data/services"
	"go.uber.org/zap"
)

func main() {
	cfg, err := bootstrap.LoadConfig()
	if err != nil {
		panic(err)
	}
	log := bootstrap.NewLogger(cfg.Server.Env)
	defer log.Sync()

	db, err := bootstrap.NewDatabase(cfg.Database)
	if err != nil {
		log.Fatal("database init failed", zap.Error(err))
	}

	if cfg.Seed.Enabled {
		bootstrap.Seed(db, log)
	}

	// Repositories
	userRepo := repositories.NewUserRepository(db)
	productRepo := repositories.NewProductRepository(db)
	categoryRepo := repositories.NewCategoryRepository(db)
	cartRepo := repositories.NewCartRepository(db)
	orderRepo := repositories.NewOrderRepository(db)
	wishlistRepo := repositories.NewWishlistRepository(db)
	shopRepo := repositories.NewShopRepository(db)

	// Services
	authSvc := services.NewAuthService(userRepo, cfg.JWT)
	productSvc := services.NewProductService(productRepo)
	recSvc := services.NewRecommendationService(productRepo, cfg.ML.URL)
	cartSvc := services.NewCartService(cartRepo, productRepo, orderRepo)
	eventSvc := services.NewEventService(cfg.Events.URL)

	// Controllers
	ctrls := routes.Controllers{
		Auth:      controllers.NewAuthController(authSvc),
		Product:   controllers.NewProductController(productSvc, recSvc),
		Category:  controllers.NewCategoryController(categoryRepo),
		Recommend: controllers.NewRecommendationController(recSvc),
		Event:     controllers.NewEventController(eventSvc),
		Cart:      controllers.NewCartController(cartSvc),
		Order:     controllers.NewOrderController(orderRepo),
		Wishlist:  controllers.NewWishlistController(wishlistRepo),
		Seller:    controllers.NewSellerController(productSvc, productRepo, orderRepo, shopRepo),
		Profile:   controllers.NewProfileController(userRepo),
	}

	app := fiber.New(fiber.Config{
		AppName:      "ShopAI Backend",
		ErrorHandler: defaultErrorHandler,
	})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	routes.Register(app, ctrls, authSvc)

	log.Info("backend listening", zap.String("port", cfg.Server.Port))
	if err := app.Listen(":" + cfg.Server.Port); err != nil {
		log.Fatal("listen failed", zap.Error(err))
	}
}

func defaultErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{"success": false, "error": err.Error()})
}
