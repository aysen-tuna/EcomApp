🛍️ EcomApp

Modern full-stack e-commerce application built with Next.js, Firebase, Stripe, and Vercel Blob.

The app supports authentication, admin product management, Stripe payments, and real-time order tracking.

✨ Features
🔐 Authentication
• Email & password signup/login
• Secure logout
• Automatic redirect for authenticated users
• Clear error handling
• Admin role stored in Firestore (admin: true)

🎨 Theme Management
• Powered by next-themes
• User preference saved in Firestore
• Auto-applied on login
• Switch anytime from navbar

🛠️ Admin Panel

Only users with admin: true can access admin routes.

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
   imageUrls: string[];
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  stripeProductId: string;
  stripePriceId: string;
}
```

🖼️ Image Upload
• Single or multiple image upload
• Stored in Vercel Blob
• URLs saved to Firestore
• Minimum one image required
• Removed images are deleted from Blob

✏️ Edit Product
• Form prefilled with existing data
• Add/remove images
• Firestore updates automatically
• Blob cleanup handled

🗑️ Delete Product
When admin deletes a product:
• Firestore document removed
• Related Blob images deleted

📦 Cart & Checkout
Flow: 1. User adds products to cart 2. Stripe Checkout Session created 3. User completes payment 4. Stripe webhook fires 5. Order saved to Firestore 6. Product stock decreased 7. Order appears in My Orders

💳 Stripe Integration
• Secure Checkout Sessions
• Session cookies for user tracking
• Webhook-driven order creation
• Stock auto-decrement after payment
• Cart auto-cleared on success page

🧪 Testing

Unit Tests (Jest)

Covers:
• Zod validation
• Utility functions
• Price calculations
Run:npm run test

E2E Tests (Playwright)
Covered flows:
• Admin creates product
• Image upload validation
• Error handling

Run:npx playwright test
npx playwright test --ui

````js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read:   if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
      allow delete: if false;
    }
	match /users/{uid}/orders/{orderId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid;
  allow update: if request.auth != null && request.auth.uid == uid;
  allow delete: if false;
}
    function isAdmin() {
      return request.auth != null
             && exists(/databases/$(database)/documents/users/$(request.auth.uid))
             && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
    match /products/{productId} {
      allow read: if true;
      allow create: if  true;
      allow update: if  true;
      allow delete: if  true;
    }
  }
}


🧱 Tech Stack
	•	Next.js (App Router)
	•	React
	•	TypeScript
	•	Firebase Auth
	•	Firestore
	•	Stripe
	•	Vercel Blob
	•	Zod
	•	Tailwind CSS
	•	shadcn/ui
	•	next-themes
	•	Playwright
	•	Jest

🚀 Local Development
    npm install
    npm run dev

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
````

⚠️ Never commit .env files to GitHub.
