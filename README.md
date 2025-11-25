# Product Management App

A modern Vue 3 product management application built with Composition API, Pinia for state management, Vue Router for navigation, and Tailwind CSS for styling. The app integrates with the DummyJSON API for product and authentication services.

## Features

- **User Authentication**: Secure login with JWT token handling and session persistence
- **Product Management**: View, create, update, and delete products
- **Product Listing**: Search and filter products by title, category, and stock status
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **State Management**: Centralized state using Pinia stores
- **Toast Notifications**: User feedback via vue-toastification

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Router**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Notifications**: vue-toastification
- **Build Tool**: Vite

## Project Structure

```
src/
├── assets/               # CSS and image assets
├── components/           # Reusable Vue components
├── router/
│   └── index.js         # Route definitions and guards
├── stores/
│   ├── auth.js          # Authentication store (Pinia)
│   ├── counter.js       # Counter store (example)
│   └── product.js       # Product management store (Pinia)
├── views/
│   ├── LoginView.vue          # Login page
│   ├── ProductListView.vue    # Product listing with filters
│   ├── ViewProductView.vue    # Product details view
│   ├── AddProductView.vue     # Create new product
│   ├── EditProductView.vue    # Edit existing product
│   └── ConfirmModal.vue       # Reusable confirmation modal
├── App.vue              # Root component
└── main.js              # Application entry point
```

## Setup & Installation

### Prerequisites

- Node.js 20.19.0 or 22.12.0+
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm preview
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with automatic fixes
- `npm run format` - Format code with Prettier

## API Integration

The app uses the [DummyJSON API](https://dummyjson.com) for all backend operations:

- **Auth Endpoint**: `POST https://dummyjson.com/auth/login`
- **Products Endpoint**: `GET https://dummyjson.com/products`
- **Single Product**: `GET https://dummyjson.com/products/{id}`
- **Add Product**: `POST https://dummyjson.com/products/add`
- **Update Product**: `PUT https://dummyjson.com/products/{id}`
- **Delete Product**: `DELETE https://dummyjson.com/products/{id}`
- **Categories**: `GET https://dummyjson.com/products/category-list`

## Pages Overview

### 1. Login Page (`/login`)
- Centered login form with email/username and password fields
- Show/hide password toggle
- Remember me checkbox
- Error message display
- Automatic redirect to products page on successful login
- Prevents logged-in users from accessing this page

### 2. Product List Page (`/products`)
- Table view of all products with:
  - Product thumbnail (circular)
  - Title and truncated description
  - Category badge
  - Price and discount information
  - Stock status indicator
  - Clickable rows to view product details
- **Filters**:
  - Search by product title
  - Filter by category
  - Filter by stock status (In Stock, Low Stock, Out of Stock)
- "Add New Product" button
- Responsive sidebar navigation
- Logout functionality

### 3. View Product Page (`/products/:id`)
- Full product details:
  - Large product image with thumbnails
  - Complete description
  - Price with discount calculation
  - Stock status with color coding
  - Brand and SKU information
  - Customer rating and reviews
- **Actions**:
  - Edit button (navigates to edit page)
  - Delete button (with confirmation modal)
  - Back button to return to product list
- Logout functionality
- Loading state display

### 4. Add Product Page (`/products/new`)
- Form with fields:
  - Product title (required)
  - Description
  - Category (dropdown with dynamic options)
  - Price (required)
  - Stock quantity (required)
  - Thumbnail URL
- Form validation with error messages
- Cancel and Save buttons
- Automatic redirect to product details on success

### 5. Edit Product Page (`/products/:id/edit`)
- Pre-populated form with existing product data
- Same fields as Add Product page
- Form validation
- Automatic redirect to product details on success

## State Management (Pinia)

### Auth Store (`src/stores/auth.js`)
**State:**
- `token`: JWT access token
- `refreshToken`: Refresh token (optional)
- `user`: User information object

**Getters:**
- `isAuthenticated`: Boolean indicating if user is logged in

**Actions:**
- `login(credentials)`: Authenticate user and store token
- `logout()`: Clear auth state and localStorage
- `restoreSession()`: Restore auth state from localStorage on app load

### Product Store (`src/stores/product.js`)
**State:**
- `products`: Array of product objects
- `isLoading`: Loading state indicator
- `error`: Error message if any

**Actions:**
- `fetchProducts()`: Get all products
- `fetchProductById(id)`: Get single product by ID
- `addProduct(payload)`: Create new product
- `updateProduct(id, payload)`: Update existing product
- `deleteProduct(id)`: Delete product by ID

## Styling

The app uses **Tailwind CSS** with a custom primary color (`#000080` - navy blue) as the main accent color for:
- Buttons and button states
- Form inputs focus states
- Navigation elements
- Links and interactive elements

## Authentication Flow

1. User lands on `/login` page
2. Enters credentials and submits
3. Auth store calls DummyJSON login endpoint
4. JWT token is stored in Pinia state and localStorage
5. User is redirected to `/products`
6. Route guard checks `isAuthenticated` on protected routes
7. On page refresh, `restoreSession()` recovers the auth state from localStorage

## Key Features Implemented

✅ User authentication with token handling and persistence  
✅ Product listing with search and category/stock filters  
✅ View full product details  
✅ Create new products  
✅ Update existing products  
✅ Delete products with confirmation  
✅ Responsive design (mobile, tablet, desktop)  
✅ Loading states and error handling  
✅ Toast notifications for user feedback  
✅ Route protection for authenticated pages  
✅ Centralized state management with Pinia  

## Assumptions & Notes

1. **DummyJSON API Limitations**: The API returns mock data. Product IDs are auto-generated and may be high numbers (100+) for added products.
2. **Authorization Headers**: Auth tokens are sent with each request, though DummyJSON may not validate them strictly.
3. **Discounts**: Displayed when `discountPercentage` > 0.
4. **Stock Status Colors**:
   - Green: Stock > 50 (In Stock)
   - Orange: 0 < Stock ≤ 50 (Low Stock)
   - Red: Stock = 0 (Out of Stock)
5. **Categories**: Fetched dynamically from the API and formatted for display.
6. **Responsive**: Optimized for screens 360px and above.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Product image upload functionality
- Price range filter
- Advanced search with multiple fields
- Pagination for large product lists
- User profile management
- Product reviews/ratings submission
- Export product data to CSV

## Troubleshooting

### App not loading?
- Check that Node.js version is 20.19.0 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Login not working?
- Verify internet connection to reach dummyjson.com
- Check browser console for API errors
- Try credentials: username: `emilys`, password: `emilyspass`

### Products not displaying?
- Check network tab in browser DevTools for failed requests
- Verify auth token is properly stored in localStorage
- Clear localStorage and try logging in again

## License

This project is created for AlienSoft Technologies frontend internship evaluation.

## Support

For issues or questions about this project, please contact the development team.
