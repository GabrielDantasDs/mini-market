package controller

import (
	"errors"

	"github.com/GabrielDantasDs/mini-market/database"
	"github.com/GabrielDantasDs/mini-market/types"
)

func CreateTransactions(idUser uint, transactions []types.TransactionCreateDto) (bool, error) {
	_, err := database.InsertTransactions(idUser, transactions)

	if err != nil {
		return false, errors.New("fail on create transaction")
	}

	return true, nil
}

func GetTransactions(id uint) (database.User, error) {
	user, err := database.ReadUser(id)

	if err != nil {
		return database.User{}, errors.New("fail on delete user")
	}

	return user, nil
}
