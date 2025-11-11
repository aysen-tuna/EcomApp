# Ecom Project  
Modern authentication (Login & Signup), theme management (Light / Dark / System),  
and Admin-only Product Creation built with **Next.js  + Firebase + Shadcn UI**.

---

## ✅ Features

### 🔐 Authentication
- User **Signup**
- User **Login**
- User **Logout**
- Email & password validation
- Error messages are shown clearly
- Errors automatically reset when the page changes
- Logged-in users are automatically redirected

### 🎨 Theme Management
- Uses **next-themes**
- Each user’s theme preference (**light / dark / system**) is saved in Firestore
- On login, the saved theme is applied automatically
- Users can change the theme anytime from the navbar

### 🛒 Admin Panel
Only users with `admin: true` in Firestore can access admin pages.

#### ✅ Add New Product (Admin Only)
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
  image: string,
  stock: number,
  draft: boolean,
  discount?: { rate: number },
  createdBy: string,
}

UI validation includes:
	•	Price cannot be negative or empty
	•	Stock cannot be negative
	•	Tax needs to be between 0–30
	•	Required fields must be filled
	•	Discount is optional

Backend validation checks all inputs again before writing to Firestore.

🔥 Firestore Rules:
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

🛠️ Tech Stack
	•	Next.js 14 App Router
	•	React 18
	•	TypeScript
	•	Firebase Authentication
	•	Firestore
	•	Shadcn/UI
	•	Tailwind CSS
	•	next-themes


🚀 How to Run Locally
//bash
npm install
npm run dev

Environment variables required:
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=