export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
}

export interface CartItem {
    readonly id: string;
    readonly product: Product;
    readonly quantity: number;
}

export interface Cart {
    readonly customer: string;
    readonly items: readonly CartItem[];
}