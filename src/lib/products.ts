import { db } from "@/lib/firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type ProductInput = {
  title: string;
  description: string;
  brand: string;
  serialNumber: string;
  category: string;
  price: {
    amount: number;
    currency: "EUR";
  };
  taxRate: number;
  stock: number;
  draft: boolean;
  discount?: {
    rate: number;
  };
  imageUrls: string[];
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  stripeProductId: string;
  stripePriceId: string;
};
