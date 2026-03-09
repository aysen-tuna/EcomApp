import { productSchema } from '@/lib/productSchema';
import { ProductCategories } from '@/lib/productCategories';

describe('productSchema', () => {
  const validProduct = {
    title: 'Urban Sweatshirt',
    description: 'Nice Sweatshirt',
    brand: 'ShopWave',
    serialNumber: 'SW-50CLO-002',
    category: ProductCategories[0],
    price: { amount: 60, currency: 'EUR' as const },
    taxRate: 18,
    stock: 18,
    draft: false,
    discount: undefined,
    imageUrls: ['https://example.com/a.jpg'],
  };

  it('should parse a valid product', () => {
    const result = productSchema.parse(validProduct);

    expect(result.title).toBe('Urban Sweatshirt');
    expect(result.serialNumber).toBe('SW-50CLO-002');
    expect(result.price.amount).toBe(60);
    expect(result.price.currency).toBe('EUR');
    expect(result.stock).toBe(18);
  });

  it('should throw error if title is empty', () => {
    const product = { ...validProduct, title: '   ' };

    expect(() => productSchema.parse(product)).toThrow('Title is required');
  });

  it('should throw error if serialNumber is empty', () => {
    const product = { ...validProduct, serialNumber: '' };

    expect(() => productSchema.parse(product)).toThrow('Serial Number is required');
  });

  it('should throw error if stock is negative', () => {
    const product = { ...validProduct, stock: -1 };

    expect(() => productSchema.parse(product)).toThrow('Stock cannot be negative');
  });

  it('should throw error if price is not positive', () => {
    const product = {
      ...validProduct,
      price: { amount: 0, currency: 'EUR' },
    };

    expect(() => productSchema.parse(product)).toThrow('Price must be greater than 0');
  });

  it('should require at least one valid image URL', () => {
    const productWithoutImages = {
      ...validProduct,
      imageUrls: [],
    };

    expect(() => productSchema.parse(productWithoutImages)).toThrow('At least 1 image is required');
  });

  it('should throw error if discount rate is out of range', () => {
    const product = {
      ...validProduct,
      discount: { rate: 200 },
    };

    expect(() => productSchema.parse(product)).toThrow();
  });

  it('should coerce string numbers to numbers', () => {
    const product = {
      ...validProduct,
      price: { amount: '60', currency: 'EUR' },
      taxRate: '18',
      stock: '18',
    };

    const result = productSchema.parse(product);

    expect(result.price.amount).toBe(60);
    expect(result.taxRate).toBe(18);
    expect(result.stock).toBe(18);
  });
});
