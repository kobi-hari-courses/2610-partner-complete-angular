// reset the cart
// update the customer name
// increase an item quantity to the cart
// decrease an item quantity from the cart
// change an item order in the cart

import { Cart, EMPTY_CART, Product } from "../models/shop.model";
import { change, mutate, Updater } from "../tools/immutables";

export function resetCart(): Updater<Cart> {
    return _ => EMPTY_CART;
}

export function updateCustomerName(name: string): Updater<Cart> {
    return cart => change(cart, _=>({customer: name}))
}

export function incrementProduct(product: Product): Updater<Cart> {
    return cart => mutate(cart, c => {
        const cartItem = c.items.find(i => i.product.id === product.id);

        if (cartItem) {
            cartItem.quantity++;
            return;
        }

        c.items.push({
            product, 
            quantity: 1
        })
    });
}

export function decrementProduct(product: Product): Updater<Cart> {
    return cart => mutate(cart, c => {
        const cartItem = c.items.find(i => i.product.id === product.id);

        if (!cartItem) return;

        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            return;
        }

        c.items = c.items.filter(it => it.product.id !== product.id);
    })
}

export function changeItemIndex(oldIndex: number, newIndex: number): Updater<Cart> {
    return cart => mutate(cart, c => {
        const oldItem = c.items[oldIndex];
        c.items[oldIndex] = c.items[newIndex];
        c.items[newIndex] = oldItem;
    })
}



