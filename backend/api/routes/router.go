package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/controllers"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/data/services"
)

type Controllers struct {
	Auth          *controllers.AuthController
	Product       *controllers.ProductController
	Category      *controllers.CategoryController
	Recommend     *controllers.RecommendationController
	Event         *controllers.EventController
	Cart          *controllers.CartController
	Order         *controllers.OrderController
	Wishlist      *controllers.WishlistController
	Seller        *controllers.SellerController
	Profile       *controllers.ProfileController
}

func Register(app *fiber.App, c Controllers, auth *services.AuthService) {
	app.Get("/health", func(ctx *fiber.Ctx) error {
		return ctx.JSON(fiber.Map{"status": "ok"})
	})

	api := app.Group("/api/v1")

	// Public
	api.Get("/products", c.Product.List)
	api.Get("/products/:id", c.Product.Get)
	api.Get("/products/:id/similar", c.Product.Similar)
	api.Get("/categories", c.Category.List)
	api.Get("/trending", c.Product.Trending)
	api.Get("/recommendations/popular", c.Recommend.Popular)
	api.Post("/events", c.Event.Track)

	// Auth
	api.Post("/auth/register", c.Auth.Register)
	api.Post("/auth/login", c.Auth.Login)
	api.Post("/auth/refresh", c.Auth.Refresh)

	authed := api.Use(middleware.RequireAuth(auth))

	authed.Post("/auth/become-seller", c.Auth.BecomeSeller)

	// Buyer
	buyer := api.Group("/buyer", middleware.RequireAuth(auth))
	buyer.Get("/cart", c.Cart.List)
	buyer.Post("/cart", c.Cart.Add)
	buyer.Delete("/cart/:productId", c.Cart.Remove)
	buyer.Post("/cart/checkout", c.Cart.Checkout)
	buyer.Get("/orders", c.Order.MyOrders)
	buyer.Get("/orders/:id", c.Order.Get)
	buyer.Get("/wishlist", c.Wishlist.List)
	buyer.Post("/wishlist", c.Wishlist.Add)
	buyer.Delete("/wishlist/:productId", c.Wishlist.Remove)
	buyer.Get("/recommendations", c.Recommend.ForUser)
	buyer.Get("/profile", c.Profile.Get)
	buyer.Put("/profile", c.Profile.Update)

	// Seller
	seller := api.Group("/seller", middleware.RequireAuth(auth), middleware.RequireRole("seller", "admin"))
	seller.Get("/dashboard", c.Seller.Dashboard)
	seller.Get("/products", c.Seller.Products)
	seller.Post("/products", c.Seller.CreateProduct)
	seller.Put("/products/:id", c.Seller.UpdateProduct)
	seller.Delete("/products/:id", c.Seller.DeleteProduct)
	seller.Get("/orders", c.Seller.ShopOrders)
	seller.Put("/orders/:id/status", c.Order.UpdateStatus)
	seller.Get("/shop", c.Seller.GetShop)
	seller.Put("/shop", c.Seller.UpdateShop)
	seller.Get("/analytics", c.Seller.Analytics)
}
