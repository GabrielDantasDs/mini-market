import { Product } from "@/reducers/cartReducer";
import api from "../../../../../../router";

type ProductDto = {
	id: number;
	price: number;
};

export function addToAccount(form: ProductDto[]) {
    const response = api.post("/account/add", form);

    return response;
}