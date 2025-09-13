import Quagga from "quagga";

export function barCodeRead(imageData) {
	const code = null;

	Quagga.decodeSingle(
		{
			src: imageData, // base64 image
			numOfWorkers: 0, // disable workers for single image
			inputStream: {
				type: "ImageStream",
				size: "800", // resize for better detection
			},
			decoder: {
				readers: ["code_128_reader", "ean_reader", "ean_8_reader"], // supported formats
			},
			locate: true,
			debug: {
				drawBoundingBox: true,
				showFrequency: true,
				drawScanline: true,
				showPattern: true,
			},
		},
		(result) => {
			if (result && result.codeResult) {
				code = result.codeResult.code;
			}
		}
	);

    return code;
}
