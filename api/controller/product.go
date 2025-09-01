package controller

import (
	"errors"

	"github.com/GabrielDantasDs/mini-market/database"
	"github.com/GabrielDantasDs/mini-market/types"
)

func CreateProduct(product types.ProductCreateDto) (uint, error) {
	_product := types.Product{Name: product.Name, Price: int(product.Price * 100), Code: product.Code}

	id_created_product, err := database.InsertProduct(_product)

	if err != nil {
		return 0, errors.New(err.Error())
	}

	return id_created_product, nil
}

func UpdateProduct(id uint, product types.ProductUpdateDto) (uint, error) {
	update_fields := make(map[string]interface{})

	if product.Name != nil {
		update_fields["name"] = *product.Name
	}

	if product.Price != nil {
		update_fields["price"] = *product.Price
	}

	if product.Code != nil {
		update_fields["code"] = *product.Code
	}

	if len(update_fields) > 0 {
		id_updated_product, err := database.UpdateProduct(id, update_fields)
		if err != nil {
			return 0, errors.New("fail on update product")
		}

		return id_updated_product, nil
	}

	return 0, nil
}

func DeleteProduct(id uint) (uint, error) {
	id_deleted_product, err := database.DeleteProduct(id)

	if err != nil {
		return 0, errors.New("fail on delete product")
	}

	return id_deleted_product, nil
}

func GetProduct(id uint) (database.Product, error) {
	product, err := database.ReadProduct(id)

	if err != nil {
		return database.Product{}, errors.New("fail on get product")
	}

	return product, nil
}

func GetAllProduct() ([]database.Product, error) {
	products, err := database.ReadProducts()

	if err != nil {
		return nil, errors.New("fail on get product")
	}

	for i, item := range products {
		products[i].Price = item.Price / 100
	}

	return products, nil
}
