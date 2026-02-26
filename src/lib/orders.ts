import {
  collection,
  onSnapshot,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export type OrderItem = {
  title: string;
  qty: number;
  unitAmount: number;
  currency?: string;
  imageUrl?: string;
};

export type OrderDoc = {
  id: string;
  status?: string;
  amountTotal?: number;
  createdAt?: Timestamp;
  items?: OrderItem[];
};

export function listenUserOrders(
  uid: string,
  onChange: (orders: OrderDoc[]) => void,
) {
  const ref = collection(db, "users", uid, "orders");
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders: OrderDoc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<OrderDoc, "id">),
    }));

    onChange(orders);
  });
}
