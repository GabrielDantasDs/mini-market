package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/GabrielDantasDs/mini-market/auth"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	// IMPORTANT: you must specify an OPTIONS method matcher for the middleware to set CORS headers
	router.Use(corsMiddleware)

	router.HandleFunc("/", auth.JwtValidate(homeHandler)).Methods("GET")

	router.HandleFunc("/login", loginHandler).Methods("POST", "OPTIONS")

	//Users routes
	router.HandleFunc("/register", createUserHandler).Methods("POST", "OPTIONS")

	//Protecteds
	router.HandleFunc("/users/update/{id}", auth.JwtValidate(upadteUserHandler)).Methods("PUT")
	router.HandleFunc("/users/delete/{id}", auth.JwtValidate(deleteUserHandler)).Methods("DELETE")
	router.HandleFunc("/users/{id}", auth.JwtValidate(getUserHandler)).Methods("GET")

	router.HandleFunc("/products", auth.JwtValidate(createProductHandler)).Methods("POST")
	//Products
	router.HandleFunc("/products/list", auth.JwtValidate(getAllProductHandler)).Methods("GET", "OPTIONS")
	router.HandleFunc("/products/delete/{id}", auth.JwtValidate(deleteProductHandler)).Methods("DELETE")
	router.HandleFunc("/products/update/{id}", auth.JwtValidate(updateProductHandler)).Methods("PATCH")
	router.HandleFunc("/products/{id}", auth.JwtValidate(getProductHandler)).Methods("GET")

	fmt.Println("Server running on port 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Se for preflight, retorna 200 sem chamar o handler
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
