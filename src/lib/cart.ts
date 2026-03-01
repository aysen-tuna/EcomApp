const EVT = "cart:changed";

const PREFIX = "cart_v2_";

export type CartItem = { priceId: string; qty: number };

function getKey(userId?: string) {
  return `${PREFIX}${userId ?? "guest"}`;
}

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVT));
}

function safeRead(key: string): CartItem[] {
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

export function getCartQty(priceId: string, userId?: string) {
  const items = getCartItems(userId);
  return items.find((x) => x.priceId === priceId)?.qty ?? 0;
}

export function getCartItems(userId?: string): CartItem[] {
  return safeRead(getKey(userId));
}

export function saveCartItems(items: CartItem[], userId?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getKey(userId), JSON.stringify(items));
  emit();
}

export function addPriceToCart(
  priceId: string,
  userId?: string,
  maxQty?: number,
) {
  const items = getCartItems(userId);
  const found = items.find((x) => x.priceId === priceId);

  const currentQty = found?.qty ?? 0;

  if (typeof maxQty === "number") {
    if (maxQty <= 0) return;
    if (currentQty >= maxQty) return;
  }

  if (found) {
    found.qty += 1;
  } else {
    items.push({ priceId, qty: 1 });
  }

  saveCartItems(items, userId);
}

export function removeOneFromCart(priceId: string, userId?: string) {
  const items = getCartItems(userId);
  const found = items.find((x) => x.priceId === priceId);
  if (!found) return;

  found.qty -= 1;

  const cleaned = items.filter((x) => x.qty > 0);
  saveCartItems(cleaned, userId);
}

export function clearCart(userId?: string) {
  saveCartItems([], userId);
}

export function getCartCount(userId?: string) {
  return getCartItems(userId).reduce((sum, x) => sum + x.qty, 0);
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
