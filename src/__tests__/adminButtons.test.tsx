import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductList from "@/app/ProductList";

jest.mock("@/app/actions/admin/products/delete", () => ({
  deleteProduct: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("@/app/AuthProvider", () => ({
  useAuth: () => ({
    user: { uid: "admin1", email: "admin@test.com" },
    loading: false,
    isAdmin: true,
  }),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: () =>
    Promise.resolve({
      docs: [
        {
          id: "p1",
          data: () => ({
            title: "bike",
            serialNumber: "tr008976",
            stock: 9,
            price: { amount: 150, currency: "EUR" },
            stripePriceId: "price_123",
            imageUrls: [],
          }),
        },
      ],
    }),
}));

test("admin should see Edit and Delete buttons", async () => {
  render(<ProductList />);

  await screen.findByText("bike");

  expect(screen.getByText("Edit")).toBeInTheDocument();
  expect(screen.getByText("Delete")).toBeInTheDocument();
});
