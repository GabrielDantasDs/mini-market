"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProducts } from "../api/route";
import { formatToBRL } from "@/app/utils";
import { Cart } from "iconoir-react";
import { useCart } from "@/components/CartContext";
import { Product as ProductReduceType } from "@/reducers/cartReducer"

type Product = {
	ID: number;
	Name: string;
	Price: number;
	Code: string;
	Available?: boolean
};

export default function List() {
	const [products, setProducts] = useState<Product[]>([]);

	const { cart, dispatch } = useCart();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await getProducts()
			.then((res) => {
				if (res.status == 200) {
					const data = res.data.map((product: Product) => {
						product.Available = true;
						console.log(cart)
						if (cart.length > 0 && cart.find(item => item.code == product.Code)) {
							product.Available = false
						}

						return product;
					});

					setProducts(data);
				}
			})
			.catch((err) => {
				console.log(err)
				Swal.fire("Ops", "Something went wrong", "error");
				return;
			});
	};

	const addProductToCart = (product: Product) => {
		if (!product.Available) {
			return
		}

		const product_cast = {
			id: product.ID,
			name: product.Name,
			price: product.Price,
			code: product.Code,
			available: false
		};

		Swal.fire("Success", "Product add to cart!", 'success');

		dispatch({ type: "ADD", product: {...product_cast}});

		const _products = products.map((item: Product) => {
			if (item.ID == product.ID) product.Available = false;
			return item; 
		})

		setProducts(_products)
	};

	return (
		<div className="overflow-x-auto rounded-2xl shadow-md">
			<table className="min-w-full text-sm text-left text-gray-700">
				{/* Header */}
				<thead className="bg-gray-100 text-gray-900 uppercase text-xs">
					<tr>
						<th scope="col" className="px-6 py-3">
							Name
						</th>
						<th scope="col" className="px-6 py-3">
							Price
						</th>
						<th scope="col" className="px-6 py-3">
							Code
						</th>
						<th scope="col" className="px-6 py-3">
							
						</th>
					</tr>
				</thead>

				{/* Body */}
				<tbody>
					{products.map((row: Product, index) => (
						<tr
							key={index}
							className={`border-b ${
								index % 2 === 0 ? "bg-white" : "bg-gray-50"
							} hover:bg-gray-100 transition`}
						>
							<td className="px-6 py-4">{row.Name}</td>
							<td className="px-6 py-4">
								{formatToBRL(row.Price)}
							</td>
							<td className="px-6 py-4">{row.Code}</td>
							<td className="px-6 py-4">
								<button type="button" onClick={(e) => {e.preventDefault(); addProductToCart(row)}} disabled={!row.Available} className={row.Available ? "cursor-pointer" : ""}>
									<Cart color={row.Available ? "green" : "red"}/>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
