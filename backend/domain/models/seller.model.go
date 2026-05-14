package models

type ProductUpsertRequest struct {
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	Price         float64  `json:"price"`
	OriginalPrice float64  `json:"original_price"`
	Stock         int      `json:"stock"`
	CategorySlug  string   `json:"category_slug"`
	Icon          string   `json:"icon"`
	ColorFrom     string   `json:"color_from"`
	ColorTo       string   `json:"color_to"`
	Colors        []string `json:"colors"`
	Sizes         []string `json:"sizes"`
	Specs         string   `json:"specs"`
	Status        string   `json:"status"`
}

type ShopUpdateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Logo        string `json:"logo"`
}
