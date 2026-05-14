package bootstrap

import (
	"github.com/lib/pq"
	"github.com/sk/shopai/backend/domain/entities"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Seed populates a fresh database with the 7 categories and 12 products
// from the design prototype, plus 5 mock reviews and a demo seller account.
// No-ops if products already exist.
func Seed(db *gorm.DB, log *zap.Logger) {
	var count int64
	db.Model(&entities.Product{}).Count(&count)
	if count > 0 {
		log.Info("seed: skipped (products already exist)", zap.Int64("count", count))
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	demoSeller := entities.User{
		Name: "ShopAI Demo Seller", Email: "seller@shopai.dev",
		PasswordHash: string(hash), Role: "seller", IsSeller: true,
		Avatar: "S", Phone: "020-555-0001",
	}
	db.Create(&demoSeller)
	shop := entities.Shop{
		UserID: demoSeller.ID, Name: "ShopAI Official",
		Description: "ร้านค้าตัวอย่างของ ShopAI", Logo: "🏪",
		Rating: 4.8, TotalSales: 25000, IsVerified: true,
	}
	db.Create(&shop)

	cats := []entities.Category{
		{Slug: "all", Name: "ทั้งหมด", Icon: "🏪", Count: 12450},
		{Slug: "electronics", Name: "อิเล็กทรอนิกส์", Icon: "📱", Count: 3420},
		{Slug: "fashion", Name: "แฟชั่น", Icon: "👗", Count: 5678},
		{Slug: "home", Name: "บ้านและสวน", Icon: "🏠", Count: 2340},
		{Slug: "sports", Name: "กีฬา", Icon: "⚽", Count: 1890},
		{Slug: "beauty", Name: "ความงาม", Icon: "💄", Count: 4560},
		{Slug: "food", Name: "อาหาร", Icon: "🍜", Count: 890},
	}
	db.Create(&cats)

	products := []entities.Product{
		{ShopID: shop.ID, CategorySlug: "electronics", Name: "iPhone 15 Pro Max 256GB ไทตาเนียม",
			Description: "สมาร์ทโฟนระดับพรีเมียมจาก Apple พร้อมชิป A17 Pro, กล้อง 48MP Triple Camera",
			Price: 45900, OriginalPrice: 52900, Discount: 13, Stock: 23, Status: "active",
			SoldCount: 5678, Rating: 4.8, ReviewCount: 1234, IsAIRecommended: true,
			Icon: "📱", ColorFrom: "#0f0c29", ColorTo: "#302b63",
			Colors: pq.StringArray{"#c0c0c0", "#2c2c2c", "#d4af37", "#1b4d3e"},
			Specs:  `[["จอแสดงผล","6.7\" Super Retina XDR OLED"],["ชิป","Apple A17 Pro"],["กล้องหลัก","48MP Triple Camera"],["แบตเตอรี่","4,422 mAh"],["RAM","8GB"],["ความจุ","256GB"]]`},
		{ShopID: shop.ID, CategorySlug: "sports", Name: "Nike Air Max 270 รองเท้าวิ่งผู้ชาย",
			Description: "รองเท้าวิ่งพรีเมียมพร้อมเทคโนโลยี Air Max 27mm",
			Price: 3990, OriginalPrice: 4990, Discount: 20, Stock: 45, Status: "active",
			SoldCount: 2340, Rating: 4.6, ReviewCount: 890, IsAIRecommended: true,
			Icon: "👟", ColorFrom: "#134e5e", ColorTo: "#71b280",
			Colors: pq.StringArray{"#1a1a1a", "#ffffff", "#d4a017", "#ef4444"},
			Sizes:  pq.StringArray{"39", "40", "41", "42", "43", "44", "45"},
			Specs:  `[["วัสดุ","Mesh + Synthetic"],["ส่วนสูง","27mm Air Unit"],["พื้น","Rubber Outsole"]]`},
		{ShopID: shop.ID, CategorySlug: "fashion", Name: "กระเป๋าหนังแท้ Premium Mini Bag",
			Description: "กระเป๋าหนังแท้คุณภาพสูง ดีไซน์หรูหรา",
			Price: 12500, OriginalPrice: 15000, Discount: 17, Stock: 8, Status: "active",
			SoldCount: 890, Rating: 4.9, ReviewCount: 456, IsNew: true,
			Icon: "👜", ColorFrom: "#5c3d2e", ColorTo: "#a0522d",
			Colors: pq.StringArray{"#5c3d2e", "#1a1a1a", "#c8a87a"},
			Specs:  `[["วัสดุ","Genuine Leather"],["ขนาด","20×15×8 cm"],["สาย","ถอดได้"]]`},
		{ShopID: shop.ID, CategorySlug: "home", Name: "Dyson V15 Detect เครื่องดูดฝุ่นไร้สาย",
			Description: "เครื่องดูดฝุ่นไร้สายอันดับ 1 พร้อม Laser Detect Technology",
			Price: 18900, OriginalPrice: 22900, Discount: 17, Stock: 15, Status: "active",
			SoldCount: 1234, Rating: 4.7, ReviewCount: 678, IsAIRecommended: true,
			Icon: "🌀", ColorFrom: "#1a1a2e", ColorTo: "#e94560",
			Specs: `[["กำลังดูด","230 AW"],["เวลาใช้งาน","60 นาที"],["ฟิลเตอร์","HEPA H13"]]`},
		{ShopID: shop.ID, CategorySlug: "electronics", Name: "MacBook Air M3 13\" 8GB/256GB",
			Description: "MacBook Air รุ่นใหม่พร้อมชิป M3 เร็วกว่าเดิม 60%",
			Price: 41900, OriginalPrice: 44900, Discount: 7, Stock: 5, Status: "active",
			SoldCount: 8901, Rating: 4.9, ReviewCount: 2345, IsNew: true,
			Icon: "💻", ColorFrom: "#2c3e50", ColorTo: "#4a6fa5",
			Colors: pq.StringArray{"#c0c0c0", "#ffd700", "#ff9966", "#888888"},
			Specs:  `[["ชิป","Apple M3 8-core"],["RAM","8GB Unified"],["SSD","256GB"],["จอ","13.6\" Liquid Retina"]]`},
		{ShopID: shop.ID, CategorySlug: "beauty", Name: "SK-II Facial Treatment Essence 230ml",
			Description: "เอสเซนส์บำรุงผิวสูตร Pitera™",
			Price: 4890, OriginalPrice: 5890, Discount: 17, Stock: 67, Status: "active",
			SoldCount: 12345, Rating: 4.7, ReviewCount: 3456, IsAIRecommended: true,
			Icon: "🧴", ColorFrom: "#c94b4b", ColorTo: "#4b134f",
			Specs: `[["ปริมาณ","230ml"],["สำหรับ","ทุกสภาพผิว"],["สารสำคัญ","Pitera™"]]`},
		{ShopID: shop.ID, CategorySlug: "electronics", Name: "Sony WH-1000XM5 หูฟัง Noise Canceling",
			Description: "หูฟัง Over-ear อันดับ 1 ของโลก พร้อม ANC ชั้นนำ",
			Price: 11900, OriginalPrice: 13900, Discount: 14, Stock: 34, Status: "active",
			SoldCount: 4567, Rating: 4.8, ReviewCount: 1567, IsAIRecommended: true,
			Icon: "🎧", ColorFrom: "#0f2027", ColorTo: "#2c5364",
			Colors: pq.StringArray{"#1a1a1a", "#d4c5b0"},
			Specs:  `[["เชื่อมต่อ","Bluetooth 5.2"],["แบตเตอรี่","30 ชั่วโมง"],["ANC","Industry Leading"]]`},
		{ShopID: shop.ID, CategorySlug: "fashion", Name: "เสื้อยืด Uniqlo AIRism Cotton ผู้ชาย",
			Description: "เสื้อยืดผ้าคอตตอนพรีเมียม เทคโนโลยี AIRism",
			Price: 390, OriginalPrice: 490, Discount: 20, Stock: 200, Status: "active",
			SoldCount: 23456, Rating: 4.5, ReviewCount: 5678,
			Icon: "👕", ColorFrom: "#1a3a5c", ColorTo: "#2d6a9f",
			Colors: pq.StringArray{"#1a3a5c", "#1a1a1a", "#e5e5e5", "#c8a87a", "#2d6a2d"},
			Sizes:  pq.StringArray{"XS", "S", "M", "L", "XL", "2XL", "3XL"},
			Specs:  `[["วัสดุ","Cotton 100%"],["เทคโนโลยี","AIRism"],["ไซส์","XS-3XL"]]`},
		{ShopID: shop.ID, CategorySlug: "electronics", Name: "GoPro Hero 12 Black Action Camera",
			Description: "กล้องแอ็คชั่น 5.3K พร้อม HyperSmooth 6.0 กันน้ำ 10 เมตร",
			Price: 13900, OriginalPrice: 16500, Discount: 16, Stock: 0, Status: "sold_out",
			SoldCount: 2345, Rating: 4.7, ReviewCount: 789,
			Icon: "📷", ColorFrom: "#1a1a1a", ColorTo: "#3a3a3a",
			Colors: pq.StringArray{"#1a1a1a"},
			Specs:  `[["ความละเอียด","5.3K/60fps"],["กันน้ำ","10m"],["Stabilize","HyperSmooth 6.0"]]`},
		{ShopID: shop.ID, CategorySlug: "electronics", Name: "iPad Pro 12.9\" M4 Wi-Fi 256GB",
			Description: "iPad รุ่นเรือธงชิป M4 จอ Tandem OLED",
			Price: 37900, OriginalPrice: 41900, Discount: 10, Stock: 12, Status: "active",
			SoldCount: 3456, Rating: 4.9, ReviewCount: 1234, IsAIRecommended: true, IsNew: true,
			Icon: "📱", ColorFrom: "#2193b0", ColorTo: "#6dd5ed",
			Colors: pq.StringArray{"#c0c0c0", "#2c2c2c"},
			Specs:  `[["ชิป","Apple M4"],["จอ","12.9\" Tandem OLED"],["RAM","8GB"],["SSD","256GB"]]`},
		{ShopID: shop.ID, CategorySlug: "beauty", Name: "Laneige Lip Sleeping Mask Berry 20g",
			Description: "มาส์กริมฝีปากยอดขายอันดับ 1 บำรุงชุ่มชื้น",
			Price: 590, OriginalPrice: 720, Discount: 18, Stock: 500, Status: "active",
			SoldCount: 45678, Rating: 4.8, ReviewCount: 8901, IsAIRecommended: true,
			Icon: "💋", ColorFrom: "#8e2de2", ColorTo: "#f64f59",
			Specs: `[["ปริมาณ","20g"],["กลิ่น","Berry"],["ผลลัพธ์","ชุ่มชื้น 8 ชั่วโมง"]]`},
		{ShopID: shop.ID, CategorySlug: "home", Name: "Instant Pot Duo 7-in-1 6L หม้ออัดแรงดัน",
			Description: "หม้ออัดแรงดัน 7-in-1 ทำอาหารเร็วกว่า 70%",
			Price: 4990, OriginalPrice: 5990, Discount: 17, Stock: 78, Status: "active",
			SoldCount: 7890, Rating: 4.6, ReviewCount: 2345,
			Icon: "🫕", ColorFrom: "#2c3e50", ColorTo: "#95a5a6",
			Specs: `[["ความจุ","6 ลิตร"],["ฟังก์ชั่น","7-in-1"],["กำลังไฟ","1000W"]]`},
	}
	db.Create(&products)

	reviews := []entities.Review{
		{ProductID: products[0].ID, UserName: "สมชาย ว.", Avatar: "ส", Rating: 5, Text: "สินค้าดีมากครับ ส่งเร็ว บรรจุภัณฑ์แน่นหนา", HasImage: true},
		{ProductID: products[0].ID, UserName: "นิดา ก.", Avatar: "น", Rating: 4, Text: "สินค้าสวยมากค่ะ การส่งช้านิดหน่อย", HasImage: false},
		{ProductID: products[0].ID, UserName: "อนุชา พ.", Avatar: "อ", Rating: 5, Text: "ดีเยี่ยมมากครับ คุ้มค่ากับราคา", HasImage: true},
		{ProductID: products[1].ID, UserName: "มาลี ส.", Avatar: "ม", Rating: 5, Text: "สวยมากเลยค่ะ ราคาดี ขนส่งเร็ว", HasImage: false},
		{ProductID: products[1].ID, UserName: "ธนากร บ.", Avatar: "ธ", Rating: 3, Text: "สินค้าโอเคครับ สีต่างจากรูปนิดหน่อย", HasImage: false},
	}
	db.Create(&reviews)

	log.Info("seed: completed",
		zap.Int("categories", len(cats)),
		zap.Int("products", len(products)),
		zap.Int("reviews", len(reviews)),
	)
}
