const EVT = "cart:changed";

const PREFIX = "cartPrices_v1_";
function getKey(userId?: string) {
  return `${PREFIX}${userId ?? "guest"}`;
}

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVT));
}

function safeRead(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getCartPrices(userId?: string): string[] {
  const key = getKey(userId);
  return safeRead(key);
}

export function saveCartPrices(prices: string[], userId?: string) {
  if (typeof window === "undefined") return;
  const key = getKey(userId);
  localStorage.setItem(key, JSON.stringify(prices));
  emit();
}

export function addPriceToCart(priceId: string, userId?: string) {
  const current = getCartPrices(userId);
  current.push(priceId);
  saveCartPrices(current, userId);
}

export function removeOneFromCart(priceId: string, userId?: string) {
  const current = getCartPrices(userId);
  const idx = current.indexOf(priceId);
  if (idx === -1) return;
  current.splice(idx, 1);
  saveCartPrices(current, userId);
}

export function clearCart(userId?: string) {
  saveCartPrices([], userId);
}

export function getCartCount(userId?: string) {
  return getCartPrices(userId).length;
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