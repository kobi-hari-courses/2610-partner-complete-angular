import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ALL_PRODUCTS } from './data/products';
import { EMPTY_CART, Product } from './models/shop.model';
import { incrementProduct, resetCart, updateCustomerName, decrementProduct, changeItemIndex } from './updaters/shop.updaters';
import { Producer } from 'immer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // state
  readonly products = signal(ALL_PRODUCTS);
  readonly cart = signal(EMPTY_CART);

  // actions
  resetCart() {
    this.cart.update(resetCart());
  }

  updateCustomerName(name: string) {
    this.cart.update(updateCustomerName(name));
  }

  incrementProduct(product: Product) {
    this.cart.update(incrementProduct(product));
  }

  decrementProduct(product: Product) {
    this.cart.update(decrementProduct(product));
  }

  changeItemIndex(oldIndex: number, newIndex: number) {
    this.cart.update(changeItemIndex(oldIndex, newIndex));
  }


}
