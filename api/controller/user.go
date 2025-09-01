package controller

import (
	"errors"

	"github.com/GabrielDantasDs/mini-market/database"
	"github.com/GabrielDantasDs/mini-market/types"
)

func CreateUser(user types.User) (uint, error) {

	id_created_user, err := database.InsertUser(user)

	if err != nil {
		return 0, errors.New("fail on create user")
	}

	return id_created_user, nil
}

func UpdateUser(id uint, user types.User) (uint, error) {

	id_updated_user, err := database.UpdateUser(id, user)

	if err != nil {
		return 0, errors.New("fail on update user")
	}

	return id_updated_user, nil
}

func DeleteUser(id uint) (uint, error) {

	id_deleted_user, err := database.DeleteUser(id)

	if err != nil {
		return 0, errors.New("fail on delete user")
	}

	return id_deleted_user, nil
}

func GetUser(id uint) (database.User, error) {
	user, err := database.ReadUser(id)

	if err != nil {
		return database.User{}, errors.New("fail on delete user")
	}

	return user, nil
}

func GetUserByEmail(email string) (database.User, error) {
		user, err := database.ReadUserByEmail(email)

	if err != nil {
		return database.User{}, errors.New("fail on delete user")
	}

	return user, nil
}
