import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export type OrderDoc = {
  status?: string;
  amountTotal?: number;
};

export function listenUserOrders(
  uid: string,
  onChange: (orders: OrderDoc[]) => void,
) {
  const ref = collection(db, "users", uid, "orders");

  return onSnapshot(ref, (snapshot) => {
    const orders = snapshot.docs.map((doc) => doc.data() as OrderDoc);
    onChange(orders);
  });
}
