"use client";

import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { getProducts } from "../products/api/route";
import Swal from "sweetalert2";
import { useCart } from "@/components/CartContext";
import { canvas } from "framer-motion/client";
import { imageCanvaTreatment } from "@/app/utils";
import { Trash } from "iconoir-react";

export default function Scanner() {
	const { cart, dispatch } = useCart();
	const [code, setCode] = useState("");
	const [products, setProducts] = useState([]);
	const [mode, setMode] = useState("ImageStream");
	const [image, setImage] = useState(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		getProducts()
			.then((res) => {
				if (res.status == 200) {
					setProducts(res.data);
				}
			})
			.catch((error) => {
				Swal.fire("Ops", "Houve um erro");
			});
	}, []);

	useEffect(() => {
		if (mode == "LiveStream") {
			Quagga.init(
				{
					inputStream: {
						type: "LiveStream",
						target: document.querySelector("#scanner-container"), // where to show video
						constraints: {
							width: 1200,
							height: 800,
							facingMode: "environment", // back camera
						},
					},
					locator: {
						patchSize: "large",
						halfSample: true,
					},
					numOfWorkers: navigator.hardwareConcurrency || 4,
					decoder: {
						readers: ["ean_reader"], // formats
					},
					frequency: 100,
					debug: {
						drawBoundingBox: true,
						showFrequency: true,
						drawScanline: true,
						showPattern: true,
					},
					locate: true,
				},
				(err) => {
					if (err) {
						console.error("Quagga init error:", err);
						return;
					}
					Quagga.start();
				}
			);

			// Event: when a barcode is detected
			Quagga.onDetected((result) => {
				const _code = result.codeResult.code;
				setCode(_code);
				Quagga.stop(); // stop after first detection
			});
			// Cleanup on unmount
			return () => {
				Quagga.stop();
				Quagga.offDetected(() => {});
			};
		}
	}, [mode]);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const reader = new FileReader();

		reader.onload = (event) => {
			const imageBase64 = event.target?.result;

			if (typeof imageBase64 === "string") {
				const img = new Image();
				img.src = imageBase64;

				img.onload = () => {
					setImage(img);
				};
			}
		};

		reader.readAsDataURL(file);
	};

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		let context2d = canvas.getContext("2d");

		if (!context2d) return;

		imageCanvaTreatment(context2d, image, canvas);
	}, [image]);

	useEffect(() => {
		const product = products.find((item) => item.code == code);

		if (product) {
			dispatch({ type: "ADD", product: product });
		}
	}, [code]);

	const changeMode = () => {
		setMode("LiveStream");
	};

	const removeImage = () => {
		setImage(null);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
			{code ? (
				<div>{code}</div>
			) : (
				<div>
					<h1 className="text-2xl font-bold mb-4 text-gray-600">
						📷 Scan a Barcode
					</h1>
					{mode == "LiveStream" ? (
						<div>
							<div
								id="scanner-container"
								className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden shadow-lg"
							></div>
							<p className="text-gray-600 mt-4 text-center">
								Point your camera at a barcode
							</p>
						</div>
					) : (
						<div>
							{image ? (
								<div className="inline-flex">
									<canvas ref={canvasRef}></canvas>
									<button
										className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg cursor-pointer hover:bg-red-700"
										onClick={(e) => {
											e.preventDefault();
											removeImage();
										}}
									>
										<Trash></Trash>
									</button>
								</div>
							) : (
								<label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 mr-2">
									Upload File
									<input
										type="file"
										accept="image/*"
										className="hidden mb-4"
										onChange={(e) => {
											e.preventDefault();
											handleFileChange(e);
										}}
									/>
								</label>
							)}
							{!image ? (
								<button
									className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700"
									onClick={(e) => {
										e.preventDefault();
										changeMode();
									}}
								>
									Scan mode
								</button>
							) : null}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
