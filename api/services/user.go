package services

import (
	"github.com/GabrielDantasDs/mini-market/database"
)

func CheckIsAdmin(id uint) (bool, error) {
	user, err := database.ReadUser(id)

	if err != nil {
		return false, nil
	}

	if user.Type == "ADMIN" {
		return true, nil
	}

	return false, nil
}
