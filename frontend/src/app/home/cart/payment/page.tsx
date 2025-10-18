"use client";

import { Copy, Wallet } from "iconoir-react";
import Swal from "sweetalert2";
import { addToAccount } from "./api/route";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function payment() {
	const { cart, dispatch } = useCart();
	const router = useRouter();

	const startPayment = () => {
		const formated_cart = cart.map((item) => {
			return { id: item.id, price: item.price };
		});

		addToAccount(formated_cart)
			.then((res) => {
				if (res.status == 200) {
					Swal.fire(
						"Success",
						"Amount add to your account.",
						"success"
					).then((res) => {
						if (res.isConfirmed || res.isDismissed) {
							router.push("/home");
						}
					});

					dispatch({ type: "CLEAR" });
				}
			})
			.catch((err) => {
				Swal.fire("Ops", err.response.data, "error");
			});

		return;
	};

	const copyKey = () => {
		navigator.clipboard
			.writeText(process.env.NEXT_PUBLIC_PIX_KEY ?? "")
			.then(() => Swal.fire("Success", "copied!", "success"))
			.catch((err) => Swal.fire("Ops", "Failed to copy", "error"));
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
				<h1 className="text-3xl font-bold text-blue-700 mb-4">
					Payment
				</h1>
				<div className="flex flex-col sm:flex-row gap-8 w-full justify-center mt-8">
					<div className="overflow-x-auto rounded-2xl shadow-md p-8 text-center text-bold text-black">
						<div className="flex mb-8">
							<p className="mr-8">
								{process.env.NEXT_PUBLIC_PIX_KEY}
							</p>
							<button
								className="cursor-pointer"
								onClick={(e) => {
									copyKey();
								}}
							>
								<Copy />
							</button>
						</div>
						ou
						<div className="flex items-center justify-center mt-8">
							<button
								onClick={(e) => {
									startPayment();
								}}
								className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
							>
								<Wallet /> Pay after
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
