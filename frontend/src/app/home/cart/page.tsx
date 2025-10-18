"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { formatToBRL } from "@/app/utils";
import { Cart, Dollar, Xmark } from "iconoir-react";
import { useCart } from "@/components/CartContext";
import { Product as ProductReduceType } from "@/reducers/cartReducer";
import { useRouter } from "next/navigation";

type Product = {
	name: string;
	price: number;
	code: string;
};

export default function List() {
	const [products, setProducts] = useState<Product[]>([]);

	const { cart, dispatch } = useCart();
	const router = useRouter();

	useEffect(() => {
		fetchData();
	}, [cart]);

	const fetchData = () => {
		setProducts(cart);
	};

	const removeProductFromCart = (product: Product) => {
		dispatch({ type: "REMOVE", productCode: product.code });

		Swal.fire("Sucesso", "Product removed from cart", "success");
		return;
	};

	const startPayment = () => {
		router.push("/home/cart/payment");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
				<h1 className="text-3xl font-bold text-blue-700 mb-4">Cart</h1>
				<div className="flex flex-col sm:flex-row gap-8 w-full justify-center mt-8">
					{cart.length > 1 ? (
						<div className="overflow-x-auto rounded-2xl shadow-md">
							<table className="min-w-full text-sm text-left text-gray-700">
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
										<th
											scope="col"
											className="px-6 py-3"
										></th>
									</tr>
								</thead>

								{/* Body */}
								<tbody>
									{products.map((row: Product, index) => (
										<tr
											key={row.code}
											className={`border-b ${
												index % 2 === 0
													? "bg-white"
													: "bg-gray-50"
											} hover:bg-gray-100 transition`}
										>
											<td className="px-6 py-4">
												{row.name}
											</td>
											<td className="px-6 py-4">
												{formatToBRL(row.price)}
											</td>
											<td className="px-6 py-4">
												{row.code}
											</td>
											<td className="px-6 py-4">
												<button
													onClick={(e) => {
														e.preventDefault();
														removeProductFromCart(
															row
														);
													}}
												>
													<Xmark></Xmark>
												</button>
											</td>
										</tr>
									))}
								</tbody>

								<tfoot>
									<tr>
										<td colSpan={4} className="p-4">
											<div className="flex justify-end">
												<button
													className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
													onClick={(e) => {
														e.preventDefault();
														startPayment();
													}}
												>
													<Dollar /> Payment
												</button>
											</div>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					) : (
						<div className="w-full text-sm text-gray-700 text-bold text-center">
							Empty
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
