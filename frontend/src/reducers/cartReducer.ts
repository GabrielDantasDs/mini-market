export type Product = {
	id: number;
	name: string;
	price: number;
	code: string;
	available: boolean
};

export type CartAction =
	| { type: "ADD"; product: Product }
	| { type: "REMOVE"; productCode: string }
	| { type: "CLEAR" };

export function cartReducer(state: Product[], action: CartAction): Product[] {
	switch (action.type) {
		case "ADD":
			const existing = state.find(
				(product) => product.code == action.product.code
			);

			if (existing) {
				return [...state];
			}

			return [...state, action.product];
		case "REMOVE":
			return state.filter(product => product.code != action.productCode);
        case "CLEAR":
            return []
        default:
            return [...state]
	}
}
