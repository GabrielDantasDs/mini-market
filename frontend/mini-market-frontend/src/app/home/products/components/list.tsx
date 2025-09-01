"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProducts } from "../api/route";
import { formatToBRL } from "@/app/utils";

type Product = {
	Name: string;
	Price: number;
	Code: string;
};

export default function List() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await getProducts()
			.then((res) => {
				if (res.status == 200) setProducts(res.data);
			})
			.catch((err) => {
				Swal.fire("Ops", "Something went wrong", "error");
				return;
			});
	};
	return (
		<table className="table-auto">
			<thead>
				<tr className="text-black text-left">
					<th>Name</th>
					<th>Price</th>
					<th>Code</th>
				</tr>
			</thead>
			<tbody>
				{products.map((item: Product, index) => (
					<tr key={index} className="text-black">
						<td className="text-black">{item.Name}</td>
						<td className="text-black">{formatToBRL(item.Price)}</td>
						<td className="text-black">{item.Code}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
