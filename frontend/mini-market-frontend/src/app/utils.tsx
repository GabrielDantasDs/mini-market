export function formatToBRL(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

export function imageCanvaTreatment(
	ctx: CanvasRenderingContext2D,
	img: HTMLImageElement,
	canvas: HTMLCanvasElement
) {
	const imgWidth = img.width;
	const imgHeight = img.height;
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;

	// Calculate aspect ratios
	const imgAspect = imgWidth / imgHeight;
	const canvasAspect = canvasWidth / canvasHeight;

	let renderWidth, renderHeight, offsetX, offsetY;

	if (imgAspect > canvasAspect) {
		// Image is wider than canvas → fit width
		renderWidth = canvasWidth;
		renderHeight = canvasWidth / imgAspect;
		offsetX = 0;
		offsetY = (canvasHeight - renderHeight) / 2;
	} else {
		// Image is taller than canvas → fit height
		renderHeight = canvasHeight;
		renderWidth = canvasHeight * imgAspect;
		offsetX = (canvasWidth - renderWidth) / 2;
		offsetY = 0;
	}

	// Clear canvas first
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// Draw centered & scaled
	ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

	preprocessForBarcode(ctx, canvas);
}

function preprocessForBarcode(
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement
) {
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	// Grayscale + threshold
	const threshold = 128;
	for (let i = 0; i < data.length; i += 4) {
		const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
		const val = gray > threshold ? 255 : 0;
		data[i] = data[i + 1] = data[i + 2] = val;
	}

	ctx.putImageData(imageData, 0, 0);
}
