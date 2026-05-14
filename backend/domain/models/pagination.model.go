package models

type Pagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

type PaginatedResult[T any] struct {
	Items      []T        `json:"items"`
	Pagination Pagination `json:"pagination"`
}
