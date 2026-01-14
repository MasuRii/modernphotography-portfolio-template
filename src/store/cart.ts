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

export interface CartModalState {
  isOpen: boolean;
  product: string;
  size: string;
  frame: string;
  price: number;
}

export const isCartOpen = atom(false); // For Cart drawer visibility
export const cartItems = map<Record<string, CartItem>>({});

// Cart modal state
export const cartModalState = map<CartModalState>({
  isOpen: false,
  product: "",
  size: "",
  frame: "",
  price: 0,
});

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

  // Open cart modal with product details
  openCartModal(item.title, item.size, item.frame, item.price);
}

export function openCartModal(product: string, size: string, frame: string, price: number) {
  cartModalState.set({
    isOpen: true,
    product,
    size,
    frame,
    price,
  });
}

export function closeCartModal() {
  cartModalState.set({
    ...cartModalState.get(),
    isOpen: false,
  });
}

export function removeCartItem(id: string) {
  const items = { ...cartItems.get() };
  delete items[id];
  cartItems.set(items);
}

export function toggleCart() {
  isCartOpen.set(!isCartOpen.get());
}
