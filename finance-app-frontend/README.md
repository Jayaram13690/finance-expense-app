# Finance App Frontend

A modern, responsive React.js + TailwindCSS web application for managing personal finances.

## Features

✅ **User Authentication**
- Register and login with JWT tokens
- Secure password handling
- Session persistence

✅ **Dashboard**
- Overview of balance, income, and expenses
- Recent transactions list
- Budget summaries
- Savings goals progress

✅ **Transaction Management**
- Add income and expense transactions
- Categorize transactions
- View transaction history
- Delete transactions

✅ **Budget Tracking**
- Set monthly spending limits by category
- Track spending progress
- Visual progress indicators
- Over-budget alerts

✅ **Savings Goals (Pots)**
- Create multiple savings goals
- Deposit and withdraw funds
- Progress tracking
- Customizable themes

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Modern UI with TailwindCSS
- Smooth animations and transitions

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Date Handling**: date-fns

## Prerequisites

- Node.js 14+ 
- npm or yarn
- Backend API running at `http://localhost:8000`

## Installation

```bash
# 1. Clone or extract project
cd finance-app-frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your API URL (if different)
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Development

```bash
# Start development server
npm start

# Opens http://localhost:3000 automatically
```

## Build for Production

```bash
# Create optimized build
npm run build

# Output in ./build folder
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navigation.jsx
│   ├── StatCard.jsx
│   ├── TransactionList.jsx
│   ├── BudgetCard.jsx
│   ├── PotCard.jsx
│   ├── RecentTransactions.jsx
│   ├── BudgetOverview.jsx
│   ├── PotProgress.jsx
│   ├── AddTransactionModal.jsx
│   ├── AddBudgetModal.jsx
│   ├── AddPotModal.jsx
│   └── ProtectedRoute.jsx
│
├── pages/               # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── BudgetsPage.jsx
│   └── PotsPage.jsx
│
├── stores/              # Zustand state management
│   ├── authStore.js
│   └── dataStore.js
│
├── services/            # API client
│   └── api.js
│
├── utils/               # Helper functions
│   └── helpers.js
│
├── App.jsx              # Main app component
├── index.js             # React entry point
└── index.css            # Global styles
```

## Available Routes

### Public Routes
- `/login` - User login page
- `/register` - User registration page

### Protected Routes (require authentication)
- `/dashboard` - Dashboard overview
- `/transactions` - View and manage transactions
- `/budgets` - Create and manage budgets
- `/pots` - Create and manage savings goals

## API Integration

The frontend connects to the backend API at:
```
http://localhost:8000/api/v1
```

### Example API Flow
1. User registers/logs in
2. JWT token stored in Zustand auth store
3. All requests include `Authorization: Bearer TOKEN` header
4. Token automatically sent with every API call
5. Auto-logout on 401 errors

## Configuration

### API URL
Change the backend API URL in `.env`:
```
REACT_APP_API_URL=http://your-api-url:8000/api/v1
```

### Tailwind Customization
Edit `tailwind.config.js` to customize:
- Colors
- Spacing
- Fonts
- Breakpoints
- Plugins

## Components Overview

### StatCard
Displays key metrics (balance, income, expenses)

### TransactionList
Shows paginated list of transactions with delete option

### BudgetCard
Displays budget progress with visual indicators

### PotCard
Shows savings goal with deposit/withdraw functionality

### Modal Components
- AddTransactionModal
- AddBudgetModal
- AddPotModal

## State Management

### Auth Store (Zustand)
```javascript
- user: Current user object
- token: JWT token
- isAuthenticated: Auth status
- login(user, token)
- logout()
- setUser(user)
```

### Data Store (Zustand)
```javascript
- transactions: Array of transactions
- budgets: Array of budgets
- pots: Array of pots
- dashboard: Dashboard overview data
```

## Error Handling

- API errors show toast notifications
- 401 errors redirect to login
- Form validation on client-side
- Network errors handled gracefully

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile menu in navigation
- Touch-friendly buttons and inputs

## Performance Features

- Component code splitting (lazy loading)
- Debounced API calls
- Optimized re-renders with Zustand
- CSS-in-JS with TailwindCSS (no extra CSS files)
- Minimal bundle size

## Deployment

### Netlify
```bash
npm run build
# Deploy ./build folder
```

### Vercel
```bash
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### "Cannot connect to API"
- Ensure backend is running on http://localhost:8000
- Check REACT_APP_API_URL in .env
- Backend API must have CORS enabled

### "Module not found" error
- Run `npm install` again
- Delete node_modules and npm ci

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm start
```

### "Token not being saved"
- Check browser localStorage
- Ensure cookies are enabled
- Check browser console for errors

## Development Tips

### Hot Module Replacement
Changes to React components hot-reload automatically

### Redux DevTools
Zustand stores can be inspected in browser console

### Network Tab
Check API calls and responses in browser DevTools

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

MIT

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API calls
3. Backend API logs
4. GitHub issues

---

Made with ❤️ using React + TailwindCSS
