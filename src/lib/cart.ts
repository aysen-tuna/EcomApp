const KEY = "cartPrices";
const EVT = "cart:changed";

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVT));
}

export function getCartPrices(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveCartPrices(prices: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(prices));
  emit();
}

export function addPriceToCart(priceId: string) {
  const current = getCartPrices();
  current.push(priceId);
  saveCartPrices(current);
}

export function removeOneFromCart(priceId: string) {
  const current = getCartPrices();
  const idx = current.indexOf(priceId);
  if (idx === -1) return;
  current.splice(idx, 1);
  saveCartPrices(current);
}

export function clearCart() {
  saveCartPrices([]);
}

export function getCartCount() {
  return getCartPrices().length;
}

export function onCartChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}
