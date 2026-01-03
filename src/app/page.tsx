import { Suspense } from "react";
import ProductListWrapper from "@/app/ProductListWrapper";

export default function ProductsPage() {
  return (
    <Suspense fallback={<p>Loading Product List</p>}>
      <ProductListWrapper />
    </Suspense>
  );
}
