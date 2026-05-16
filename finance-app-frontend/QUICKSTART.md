# Quick Start Guide - Finance App Frontend

## 🚀 Get Running in 2 Minutes

### Prerequisites
- Node.js installed (download from nodejs.org)
- Backend API running (http://localhost:8000)

### Step 1: Install Dependencies
```bash
cd finance-app-frontend
npm install
```

This will take 1-2 minutes on first install.

### Step 2: Configure API
The frontend is already configured to connect to `http://localhost:8000/api/v1`

If your backend is on a different URL, edit `.env`:
```
REACT_APP_API_URL=http://your-backend-url:8000/api/v1
```

### Step 3: Start Development Server
```bash
npm start
```

Browser automatically opens at http://localhost:3000

## 🧪 Testing the App

### Create a Test Account
1. Click "Sign up" on login page
2. Enter email and password
3. Create account

### Add Test Data
1. Go to Transactions
2. Click "Add Transaction"
3. Create income/expense
4. Create a budget
5. Create a savings pot

### View Dashboard
- See your balance, income, expenses
- View recent transactions
- See budget progress
- Check savings goals

## 📁 Project Structure

```
src/
├── components/     - React components (reusable UI pieces)
├── pages/         - Page components (full pages)
├── stores/        - State management with Zustand
├── services/      - API client (backend communication)
├── utils/         - Helper functions
├── App.jsx        - Main app routing
└── index.css      - Global styles with Tailwind
```

## 🎨 Styling

Styled with TailwindCSS - edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

## 🔑 Key Features

### Authentication
- Register/Login with JWT
- Automatic logout on token expiry
- Session persists across page reloads

### Dashboard
- Balance overview
- Income/expense summary
- Recent transactions
- Budget summaries
- Savings progress

### Transactions
- Add income/expense
- Categorize transactions
- View history
- Delete transactions

### Budgets
- Set spending limits
- Monthly tracking
- Visual progress
- Over-budget alerts

### Pots (Savings Goals)
- Create multiple goals
- Deposit/withdraw
- Progress tracking
- Color customization

## 🔧 Development

### Available Scripts

```bash
# Start dev server (with hot reload)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm eject
```

## 🐛 Troubleshooting

### "Cannot GET /"
- Make sure you're on http://localhost:3000
- Backend API must be running

### "API connection failed"
- Check backend is running: http://localhost:8000/health
- Check .env has correct API URL
- Check browser console for errors

### "Port 3000 in use"
```bash
# Use different port
PORT=3001 npm start
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📝 File Format Guide

### Components
Located in `src/components/`:
- Navigation.jsx - Top navigation bar
- StatCard.jsx - Stat display card
- TransactionList.jsx - Transaction list
- BudgetCard.jsx - Budget card
- PotCard.jsx - Savings pot card
- Modal components - Popup forms

### Pages
Located in `src/pages/`:
- LoginPage.jsx - Login page
- RegisterPage.jsx - Registration page
- DashboardPage.jsx - Dashboard
- TransactionsPage.jsx - Transactions page
- BudgetsPage.jsx - Budgets page
- PotsPage.jsx - Savings pots page

### Stores (State Management)
Located in `src/stores/`:
- authStore.js - User authentication state
- dataStore.js - Application data state

### Services (API)
Located in `src/services/`:
- api.js - Axios instance with interceptors

### Utils (Helpers)
Located in `src/utils/`:
- helpers.js - Utility functions (format currency, date, etc)

## 🌐 API Endpoints Used

```
POST   /auth/register          - Register user
POST   /auth/login             - Login user
GET    /auth/me                - Get current user

GET    /transactions           - List transactions
POST   /transactions           - Create transaction
PUT    /transactions/{id}      - Update transaction
DELETE /transactions/{id}      - Delete transaction

GET    /budgets                - List budgets
POST   /budgets                - Create budget
PUT    /budgets/{id}           - Update budget
DELETE /budgets/{id}           - Delete budget

GET    /pots                   - List pots
POST   /pots                   - Create pot
PATCH  /pots/{id}/deposit      - Deposit to pot
PATCH  /pots/{id}/withdraw     - Withdraw from pot
DELETE /pots/{id}              - Delete pot

GET    /dashboard/overview     - Get dashboard data
```

## 💾 State Management

### Using Auth Store
```javascript
import { useAuthStore } from './stores/authStore';

const token = useAuthStore(state => state.token);
const logout = useAuthStore(state => state.logout);
```

### Using Data Store
```javascript
import { useDataStore } from './stores/dataStore';

const transactions = useDataStore(state => state.transactions);
const addTransaction = useDataStore(state => state.addTransaction);
```

## 🎯 Common Tasks

### Add a New Page
1. Create file in `src/pages/MyPage.jsx`
2. Import in `App.jsx`
3. Add route

### Add a New Component
1. Create file in `src/components/MyComponent.jsx`
2. Export default function
3. Import where needed

### Call an API
Use axios instance from `src/services/api.js`:
```javascript
import { transactionApi } from '../services/api';

const response = await transactionApi.getTransactions();
```

### Show Notification
```javascript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
```

## 📱 Responsive Design

- Mobile: <640px
- Tablet: 640px - 1024px  
- Desktop: >1024px

Test with DevTools device emulation.

## 🚀 Production Build

```bash
# Create optimized build
npm run build

# Test production build
npm install -g serve
serve -s build

# Open http://localhost:3000
```

## 🆘 Getting Help

1. Check browser console (F12) for errors
2. Check Network tab for API calls
3. Verify backend is running
4. Check README.md for detailed docs
5. Review component source code

---

You're all set! Start developing! 🎉
