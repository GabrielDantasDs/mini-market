package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"strconv"

	"golang.org/x/crypto/bcrypt"

	"github.com/GabrielDantasDs/mini-market/auth"
	"github.com/GabrielDantasDs/mini-market/controller"
	"github.com/GabrielDantasDs/mini-market/types"
	"github.com/gorilla/mux"
)

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req types.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	user := types.User{Name: req.Email, Password: req.Password}

	//Validação da senha e gerar JWT
	db_user, err := controller.GetUserByEmail(user.Email)

	if err != nil {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(db_user.Password), []byte(req.Password))

	if err != nil {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	tokenStr, err := auth.GenreateJwt(types.UserAuth{Id: db_user.ID, Name: db_user.Name, Email: db_user.Email})

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: tokenStr}

	json.NewEncoder(w).Encode(response)
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := types.Response{Msg: "Bem vindo ao mini-market"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.User

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	var hashedPassword []byte
	hashedPassword, err = bcrypt.GenerateFromPassword([]byte(req.Password), 4)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	user := types.User{Name: req.Email, Password: string(hashedPassword), Email: req.Email}

	id_created_user, err := controller.CreateUser(user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(id_created_user), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func upadteUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.User

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]

	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	user := types.User{Name: req.Name, Password: req.Password, Email: req.Email}

	id_created_user, err := controller.UpdateUser(uint(id), user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(id_created_user), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]

	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	id_deleted_user, err := controller.DeleteUser(uint(id))

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(id_deleted_user), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]

	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	user, err := controller.GetUser(uint(id))

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	user_json, err := json.Marshal(user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user_json)
}

func createProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.ProductCreateDto

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	id_created_product, err := controller.CreateProduct(req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(id_created_product), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func updateProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.ProductUpdateDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]

	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	idUpdated, err := controller.UpdateProduct(uint(id), req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(idUpdated), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func deleteProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]
	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	id_deleted, err := controller.DeleteProduct(uint(id))

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	response := types.Response{Msg: strconv.FormatUint(uint64(id_deleted), 10)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id_param := vars["id"]

	if id_param == "" {
		http.Error(w, "ID not provided", http.StatusNotFound)
		return
	}

	id, err := strconv.ParseUint(id_param, 10, 32)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	product, err := controller.GetProduct(uint(id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(product); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
	}
}

func getAllProductHandler(w http.ResponseWriter, r *http.Request) {
	products, err := controller.GetAllProduct()

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(products); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
	}
}

func createTransactionHandle(w http.ResponseWriter, r *http.Request) {

	idUser, ok := auth.UserFrom(r.Context())

	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req []types.TransactionCreateDto

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	fmt.Println(idUser)
	fmt.Println(req)

	transaction, err := controller.CreateTransactions(idUser, req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(transaction); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
	}
}
