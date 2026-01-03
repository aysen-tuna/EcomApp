import ProductList from "@/app/ProductList";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default async function ProductListWrapper() {
  await delay(1000);
  return <ProductList />;
}
