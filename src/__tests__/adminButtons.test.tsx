import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '@/app/ProductList';

jest.mock('@/app/actions/admin/products/delete', () => ({
  deleteProduct: jest.fn(),
}));

jest.mock('@/lib/firebase/firebase', () => ({
  db: {},
}));

jest.mock('@/components/ProductCard', () => ({
  __esModule: true,
  default: ({ isAdmin }: { isAdmin: boolean }) => (
    <div>
      {isAdmin && <button>Edit</button>}
      {isAdmin && <button>Delete</button>}
    </div>
  ),
}));

jest.mock('@/app/AuthProvider', () => ({
  useAuth: () => ({
    user: { uid: 'admin1', email: 'admin@test.com' },
    loading: false,
    isAdmin: true,
  }),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
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

test('admin should see Edit and Delete buttons', async () => {
  render(<ProductList />);

  expect(await screen.findByText('Edit')).toBeInTheDocument();
  expect(await screen.findByText('Delete')).toBeInTheDocument();
});
