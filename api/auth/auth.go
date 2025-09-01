package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/GabrielDantasDs/mini-market/types"
	"github.com/golang-jwt/jwt/v5"
)

// Colocar essa chave no .env
var jwtKey = []byte("Zy8@eP4#nD3q!sL9vT7uW6kX1fR5jC2h")

func JwtValidate(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" || len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
		}

		tokenStr := authHeader[7:]

		//verificar se o token recebido bate com meu jwt no decode

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Token inválido", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func GenreateJwt(user types.User) (string, error) {
	exp := time.Now().AddDate(0, 6, 0)
	var response string

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss": "mini-market-server",
		"sub": user.Name,
		"exp": exp.Unix(),
	})

	response, err := token.SignedString(jwtKey)

	if err != nil {
		return "", fmt.Errorf("fail on sign JWT: %w", err)
	}

	return response, nil
}
