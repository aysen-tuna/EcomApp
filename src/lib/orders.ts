import { collection, onSnapshot, Timestamp,orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export type OrderDoc = {
  status?: string;
  amountTotal?: number;
  createdAt?: Timestamp; 
};

export function listenUserOrders(
  uid: string,
  onChange: (orders: OrderDoc[]) => void,
) {
  const ref = collection(db, "users", uid, "orders");
   const q = query(ref, orderBy("createdAt", "desc"));


  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => doc.data() as OrderDoc);
    onChange(orders);
  });
}
