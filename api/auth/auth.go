package auth

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/GabrielDantasDs/mini-market/types"
	"github.com/golang-jwt/jwt/v5"
)

// Colocar essa chave no .env
var jwtKey = []byte("Zy8@eP4#nD3q!sL9vT7uW6kX1fR5jC2h")

type ctxKey string

const userCtxKey ctxKey = "user"

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

		// Extract custom claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "invalid claims", http.StatusUnauthorized)
			return
		}

		u := stringClaim(claims, "sub")

		ctx := WithUser(r.Context(), u)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func GenreateJwt(user types.UserAuth) (string, error) {
	exp := time.Now().AddDate(0, 6, 0)
	var response string

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":  "mini-market-server",
		"sub":  fmt.Sprintf("%d", user.Id),
		"name": user.Name,
		"exp":  exp.Unix(),
	})

	response, err := token.SignedString(jwtKey)

	if err != nil {
		return "", fmt.Errorf("fail on sign JWT: %w", err)
	}

	return response, nil
}

func stringClaim(m jwt.MapClaims, k string) string {
	if v, ok := m[k]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func WithUser(ctx context.Context, u string) context.Context {
	return context.WithValue(ctx, userCtxKey, u)
}

func UserFrom(ctx context.Context) (uint, bool) {
	u, ok := ctx.Value(userCtxKey).(string)

	fu, err := strconv.ParseUint(u, 10, 64)

	if err != nil {
		return 0, ok
	}

	return uint(fu), ok
}
