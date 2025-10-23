import api from "../../../../../router"

export function getProducts() {
    const response = api.get("/products/list");

    return response;
}