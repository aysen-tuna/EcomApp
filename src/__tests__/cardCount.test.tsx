import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductList from '@/app/ProductList';
import { Nav } from '@/components/Nav';

jest.mock('@/app/actions/admin/products/delete', () => ({
  deleteProduct: jest.fn(),
}));

jest.mock('@/lib/firebase/firebase', () => ({
  db: {},
}));

jest.mock(
  'next/link',
  () =>
    ({ children }: any) =>
      children,
);

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('@/app/AuthProvider', () => ({
  useAuth: () => ({
    user: { uid: 'u1', email: 'test@test.com' },
    loading: false,
    isAdmin: false,
    logout: jest.fn(),
  }),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: () =>
    Promise.resolve({
      docs: [
        {
          id: 'p1',
          data: () => ({
            title: 'Classic Cotton Tote',
            serialNumber: 'SW-50BAG-005',
            category: 'Bags',
            stock: 12,
            price: { amount: 13, currency: 'EUR' },
            stripePriceId: 'price_123',
            imageUrls: [],
          }),
        },
      ],
    }),
}));

test('cart count should increase after Add to Cart click', async () => {
  render(
    <>
      <Nav />
      <ProductList />
    </>,
  );

  await screen.findByText('Classic Cotton Tote');

  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /Add to Cart/i }));

  expect(screen.getByText('1')).toBeInTheDocument();
});
