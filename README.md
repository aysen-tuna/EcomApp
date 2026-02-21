# Ecom Project

Modern e-commerce application with authentication, theme management, admin-only product management, image uploads, and automated testing — built using Next.js, Firebase, Vercel Blob, Stripe, Playwright, and Shadcn UI.

---

### Authentication
- User **Signup**
- User **Login**
- User **Logout**
- Email & password validation
- Error messages are shown clearly
- Errors automatically reset when the page changes
- Logged-in users are automatically redirected
- Admin role stored in Firestore admin === true

---

### Theme Management
- Uses **next-themes**
- Each user’s theme preference (**light / dark / system**) is saved in Firestore
- On login, the saved theme is applied automatically
- Users can change the theme anytime from the navbar

---

### Admin Panel
Only users with `admin: true` in Firestore can access admin routes.

#### Add New Product (Admin Only)

Admin can create a new product with the following fields:

```ts
{
  title: string,
  description: string,
  brand: string,
  serialNumber: string,
  category: string,
  price: { amount: number, currency: 'EUR' },
  taxRate: number,
  stock: number,
  draft: boolean,
  discount?: { rate: number },
  imageUrls: string[],
  createdBy: string,
}
```

### Image Upload
- Admin can upload single or multiple images
- Images are uploaded to Vercel Blob Storage
- Uploaded image URLs are stored in Firestore
- At least one image is required

---

### Edit Product
- Product form is pre-filled with existing data
- Images can be removed or new images added
- When images are removed during edit:
  - They are automatically deleted from Blob storage
- Product data is updated in Firestore

---

### Delete Product
- Admin can delete a product from the admin list
- On deletion:
  - Product document is removed from Firestore
  - All associated images are deleted from Blob storage

---

### Admin Product List
- Displays all products
- Product cards include:
  - Title
  - Price
  - Stock
  - Serial number
  - Image preview
- Supports image carousel for products with multiple images
- Admin actions:
  - Edit product
  - Delete product (with confirmation)

---

### Validation

#### UI Validation
- Price must be greater than 0
- Stock cannot be negative
- Required fields must be filled
- Discount is optional

#### Backend Validation
- All inputs are validated again using Zod
- Invalid data is rejected before writing to Firestore

---

### Payments (Stripe)

Stripe is used for checkout and payment processing.

Flow:
- User adds products to cart
- Stripe Checkout Session created
- User completes payment
- Stripe webhook confirms payment
- Order saved + stock updated

---

### Testing

## Unit Tests (Jest)

Used for:
- Zod validation
- Utility functions
- Price / tax calculations

```bash
npm run test
```

---

## End-to-End Tests (Playwright)

Covered flows:
- Admin creates product (full form + image upload)
- Upload failure shows error message

Run:

```bash
npx playwright test
npx playwright test --ui
```

---

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read:   if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
      allow delete: if false;
    }

    match /products/{productId} {
      allow read: if true;

      function isAdmin() {
        return request.auth != null
          && exists(/databases/$(database)/documents/users/$(request.auth.uid))
          && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
      }

      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

---

### Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Firebase Authentication
- Firestore
- Vercel Blob Storage
- Stripe
- Zod
- Shadcn/UI
- Tailwind CSS
- next-themes
- Playwright
- Jest

---

### How to Run Locally

```bash
npm install
npm run dev
```

Environment variables required:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

BLOB_READ_WRITE_TOKEN=

TEST_EMAIL=
TEST_PASSWORD=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```
