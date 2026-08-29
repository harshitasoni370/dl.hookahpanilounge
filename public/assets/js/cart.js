/**
 * Cart state — persisted in localStorage
 */
const CART_KEY = "ff_cart_v1";

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartCount(items = loadCart()) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal(items = loadCart()) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function addToCart(product, qty = 1) {
  const items = loadCart();
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description || "",
      veg: product.veg,
      qty,
    });
  }
  saveCart(items);
  return items;
}

export function setQty(productId, qty) {
  let items = loadCart();
  if (qty <= 0) {
    items = items.filter((i) => i.id !== productId);
  } else {
    const item = items.find((i) => i.id === productId);
    if (item) item.qty = qty;
  }
  saveCart(items);
  return items;
}

export function removeFromCart(productId) {
  const items = loadCart().filter((i) => i.id !== productId);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function formatAED(amount) {
  return `AED ${Number(amount).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

/** @deprecated use formatAED — kept for existing imports */
export function formatINR(amount) {
  return formatAED(amount);
}
