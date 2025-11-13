# UrbanFrill - Interior Design E-Commerce Store

A modern, responsive e-commerce platform for interior design products built with React, Vite, and React Router.

## 🌟 Features

- **Product Catalog** - Browse furniture and interior design products
- **Category Navigation** - Curtains, Wallpapers, Bedback & Sofa, Mattress, Blinds, Flooring
- **Advanced Filtering** - Filter by price, category, and search functionality
- **Product Details** - Detailed product information with images
- **Shopping Cart** - Add items to cart (requires login)
- **User Authentication** - Firebase-powered auth system
- **Responsive Design** - Mobile-first design approach
- **Clean URL Routing** - React Router v6 with proper navigation
- **Image Optimization** - Lazy loading and responsive images

## 🚀 Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Authentication**: Firebase 12
- **Database**: Firebase Realtime Database
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🗂️ Project Structure

```
src/
├── components/
│   ├── HomePage.jsx          # Home page with products
│   ├── CategoryPage.jsx       # Category-specific pages
│   ├── ProductPage.jsx        # Product detail page
│   ├── Header.jsx             # Navigation header
│   ├── ProductFilter.jsx      # Filter sidebar
│   ├── Cart/
│   ├── Auth/
│   └── ... other components
├── context/
│   ├── AuthContext.jsx        # Auth state management
│   ├── CartContext.jsx        # Cart state management
├── data/
│   └── products.js            # Product database
└── utils/
    ├── asset.js               # Asset helpers
    └── scrollToTop.js         # Navigation utilities
```

## 🗺️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Home page with hero and products |
| `/category/:category` | CategoryPage | Category filtered products |
| `/product/:productId` | ProductPage | Product details |

## 🎯 Key Components

### HomePage
- Hero section
- Product grid
- Filter sidebar (desktop) + drawer (mobile)
- Search functionality

### CategoryPage
- Dynamic category filtering
- Same UI/UX as homepage
- URL-based navigation

### Header
- Navigation links
- Category dropdowns
- Mobile hamburger menu
- Shopping cart icon
- User profile

## 🔒 Authentication

- Firebase Email/Password auth
- Google Sign-In
- Auth state persisted in context
- Protected cart functionality

## 🛒 Shopping Cart

- Add items to cart
- Quantity management
- Cart persisted in browser context
- WhatsApp integration for purchases

## 📱 Responsive Design

- Desktop: Full sidebar + header
- Tablet: Responsive grid
- Mobile: Hamburger menu + drawer filters

## 🎨 Styling

- Tailwind CSS for utility styles
- Custom CSS for component-specific styles
- Mobile-first approach
- CSS animations and transitions

## 🚀 Deployment

### GitHub Pages

```bash
npm run deploy
```

Live at: https://shriramjangid666.github.io/urbanfrill/

### Environment Variables

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... other Firebase config
```

## 📋 Recent Updates

- ✅ Migrated from hash routing to React Router v6
- ✅ Fixed blank screen issues on navigation
- ✅ Created dedicated category pages
- ✅ Improved URL structure and sharability
- ✅ Enhanced mobile navigation

## 🐛 Known Issues & Solutions

See `ROUTING_CHANGES.md` and `DEPLOYMENT_GUIDE.md` for detailed information.

## 📝 Development Guidelines

1. **Components**: Functional components with hooks
2. **State Management**: Context API for global state
3. **Routing**: React Router v6 with useParams and useNavigate
4. **Assets**: Use `/utils/asset.js` for image paths
5. **Styling**: BEM naming convention for custom CSS

## 🔄 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Deploy (requires GitHub permissions)
npm run deploy

# Lint code
npm run lint
```

## 📞 Support

For detailed routing documentation, see:
- `ROUTING_CHANGES.md` - Complete migration details
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

## 📄 License

All rights reserved © UrbanFrill

---

**Status**: Production Ready ✅  
**Last Updated**: November 13, 2025
