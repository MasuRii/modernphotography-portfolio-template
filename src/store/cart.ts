import { map, computed, atom } from "nanostores";

export interface CartItem {
  id: string; // unique ID (e.g. product-id + size + frame)
  productId: string; // product name or slug
  title: string;
  size: string;
  frame: string;
  price: number;
  quantity: number;
}

export const isCartOpen = atom(false); // For Cart drawer visibility
export const cartItems = map<Record<string, CartItem>>({});

export const cartCount = computed(cartItems, (items) => {
  return Object.values(items).reduce((acc, item) => acc + item.quantity, 0);
});

export const cartTotal = computed(cartItems, (items) => {
  return Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0);
});

export function addCartItem(item: Omit<CartItem, "quantity" | "id">) {
  const existingItems = cartItems.get();
  const id = `${item.productId}-${item.size}-${item.frame}`.replace(/\s+/g, "-").toLowerCase();

  if (existingItems[id]) {
    cartItems.setKey(id, {
      ...existingItems[id],
      quantity: existingItems[id].quantity + 1,
    });
  } else {
    cartItems.setKey(id, {
      ...item,
      id,
      quantity: 1,
    });
  }

  // For now, just a placeholder alert until we have a real cart UI
  alert(`Added to cart: ${item.title} - ${item.size} / ${item.frame}`);
}

export function removeCartItem(id: string) {
  const items = { ...cartItems.get() };
  delete items[id];
  cartItems.set(items);
}

export function toggleCart() {
  isCartOpen.set(!isCartOpen.get());
}
