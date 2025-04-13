# E-Commerce Frontend

This is a Next.js e-commerce frontend application built with TypeScript, Material UI, and Firebase Authentication.

## Features

- User authentication with Firebase
- Product browsing and searching
- Shopping cart functionality
- Checkout process
- Order history
- Admin dashboard for product management

## TypeScript Migration

This project was migrated from JavaScript to TypeScript for improved type safety and developer experience. The migration includes:

- Strong typing for all components, functions, and data models
- Type-safe API calls with axios
- TypeScript integration with Zustand for state management
- Proper typing for Firebase authentication

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Lint the codebase
- `npm run type-check` - Check for TypeScript errors

### TypeScript Conversion

If you need to convert remaining JavaScript files to TypeScript, you can use the included conversion script:

```bash
node scripts/convert-to-ts.js
```

This script will:

1. Scan the project's source directory for JavaScript files
2. Convert `.js` files to `.ts` and React component files to `.tsx`
3. Preserve existing TypeScript files

After running the conversion script, you'll need to:

1. Run `npm run type-check` to identify type errors
2. Fix any TypeScript errors manually
3. Add proper typing to replace `any` types

## Folder Structure

- `src/app` - Next.js app router pages
- `src/components` - React components
- `src/context` - React context providers
- `src/firebase` - Firebase configuration
- `src/store` - Zustand state management
- `src/utils` - Utility functions

## Backend Integration

This frontend integrates with a REST API backend. The API endpoints are:

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product endpoints
- `/api/cart/*` - Shopping cart endpoints
- `/api/orders/*` - Order endpoints

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run lint && npm run type-check`
4. Submit a pull request

## License

This project is licensed under the MIT License.
