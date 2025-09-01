package database

import (
	"errors"

	"github.com/GabrielDantasDs/mini-market/types"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
}

type Product struct {
	gorm.Model
	Name  string
	Price int
	Code  string
}

func migrate() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&User{}, &Product{})
}

func InsertUser(user types.User) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	user_model := User{Name: user.Name, Email: user.Email, Password: user.Password}

	if err != nil {
		panic("failed to connect database")
	}

	result := db.Create(&user_model)

	if result.Error != nil {
		return 0, errors.New("fail on create user")
	}

	return user_model.ID, nil
}

func UpdateUser(id uint, user types.User) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	var user_model User

	db.First(&user_model, id)

	if err != nil {
		panic("failed to connect database")
	}

	result := db.Model(&user_model).Updates(User{
		Name:  user.Name,
		Email: user.Email,
	})

	if result.Error != nil {
		return 0, errors.New("fail on update user")
	}

	return user_model.ID, nil
}

func DeleteUser(id uint) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	var user_model User

	db.First(&user_model, id)

	if err != nil {
		panic("failed to connect database")
	}

	result := db.Delete(&user_model)

	if result.Error != nil {
		return 0, errors.New("fail on update user")
	}

	return user_model.ID, nil
}

func ReadUser(id uint) (User, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	var user_model User

	db.First(&user_model, id)

	if err != nil {
		panic("failed to connect database")
	}

	return user_model, nil
}

func ReadUserByEmail(email string) (User, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	var user_model User

	db.First(&user_model, email)

	if err != nil {
		panic("failed to connect database")
	}

	return user_model, nil
}

// Product CRUD

func InsertProduct(product types.Product) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	productModel := Product{Name: product.Name, Price: product.Price, Code: product.Code}
	result := db.Create(&productModel)

	if result.Error != nil {
		return 0, errors.New(result.Error.Error())
	}

	return productModel.ID, nil
}

func UpdateProduct(id uint, product map[string]interface{}) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var productModel Product
	db.First(&productModel, id)

	result := db.Model(&productModel).Updates(product)

	if result.Error != nil {
		return 0, errors.New("fail on update product")
	}

	return productModel.ID, nil
}

func DeleteProduct(id uint) (uint, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var productModel Product
	db.First(&productModel, id)

	result := db.Delete(&productModel)
	if result.Error != nil {
		return 0, errors.New("fail on delete product")
	}

	return productModel.ID, nil
}

func ReadProduct(id uint) (Product, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var productModel Product
	db.First(&productModel, id)

	return productModel, nil
}

func ReadProducts() ([]Product, error) {
	migrate()

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var productsModels []Product
	db.Find(&productsModels)

	return productsModels, nil
}
