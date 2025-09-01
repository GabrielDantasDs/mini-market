package types

type Response struct {
	Msg string `json:"msg"`
}

type User struct {
	Name     string
	Email    string
	Password string
}

type Product struct {
	Name  string
	Price int
	Code  string
}

type ProductCreateDto struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Code  string  `json:"code"`
}

type ProductUpdateDto struct {
	Name  *string  `json:"name,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Code  *string  `json:"code,omitempty"`
}

type LoginRequest struct {
	Email    string
	Password string
}
