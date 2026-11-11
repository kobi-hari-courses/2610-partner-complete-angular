export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
}

export interface CartItem {
    readonly product: Product;
    readonly quantity: number;
}

export interface Cart {
    readonly customer: string;
    readonly items: readonly CartItem[];
}

export const EMPTY_CART: Cart = {
    customer: "",
    items: []
};