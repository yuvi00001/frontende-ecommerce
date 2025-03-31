# E-commerce Website Frontend

This is a Next.js e-commerce frontend application that connects to a Node.js backend with Firebase authentication and PostgreSQL database.

## Features

- User authentication with Firebase (Email/Password and Google Sign-In)
- Product browsing with filtering by category and price range
- Shopping cart functionality (persisted in local storage for guest users)
- Checkout process with shipping and payment information
- Order history and tracking
- Admin dashboard for product management (admin users only)

## Tech Stack

- **Framework**: Next.js
- **UI Library**: Material UI
- **Authentication**: Firebase Authentication
- **State Management**: Zustand
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ecommerce-website.git
cd ecommerce-website/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── app/                  # Next.js app router pages
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── cart/             # Cart components
│   │   ├── layout/           # Layout components
│   │   └── products/         # Product components
│   ├── context/              # React context providers
│   ├── firebase/             # Firebase configuration
│   ├── store/                # Zustand stores
│   └── utils/                # Utility functions
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
└── package.json              # Project dependencies
```

## Backend Integration

This frontend connects to a Node.js backend with the following features:

- RESTful API endpoints for products, cart, orders, etc.
- Firebase Authentication for user management
- PostgreSQL database for data storage
- JWT tokens for API security

For more details, see the backend documentation.

## Deployment

This application can be deployed to Vercel, Netlify, or any other hosting service that supports Next.js.

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License.
