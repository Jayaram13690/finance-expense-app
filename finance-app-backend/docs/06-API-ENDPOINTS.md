# API Endpoints Reference - Finance App Backend

## Table of Contents

1. [Base URL & Versioning](#1-base-url--versioning)
2. [Authentication](#2-authentication)
3. [Transactions](#3-transactions)
4. [Budgets](#4-budgets)
5. [Pots (Savings Goals)](#5-pots-savings-goals)
6. [Dashboard](#6-dashboard)
7. [Error Responses](#7-error-responses)
8. [Pagination](#8-pagination)
9. [Authentication Flow](#9-authentication-flow)

---

## 1. Base URL & Versioning

**Base URL**: `/api/v1`

All endpoints are prefixed with the API version. The current version is `v1`.

**Content Type**: `application/json`

**Authentication**: Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 2. Authentication

### Register User

**Endpoint**: `POST /api/v1/auth/register`

**Description**: Register a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Validation**:
- `name`: String, required
- `email`: Valid email format, required, unique
- `password`: String, min 8 chars, max 72 chars, required

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-12-15T10:30:00.000Z",
  "updated_at": "2023-12-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Email already registered or validation error
- `422 Unprocessable Entity`: Invalid request format

---

### Login User

**Endpoint**: `POST /api/v1/auth/login`

**Description**: Authenticate user and get JWT token.

**Request Body** (x-www-form-urlencoded):
```
username=john@example.com&password=secure_password_123
```

**Success Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `422 Unprocessable Entity`: Invalid request format

---

### Get Current User

**Endpoint**: `GET /api/v1/auth/me`

**Description**: Get information about the currently authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-12-15T10:30:00.000Z",
  "updated_at": "2023-12-15T10:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

## 3. Transactions

### List Transactions

**Endpoint**: `GET /api/v1/transactions`

**Description**: Get a paginated list of transactions for the authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `skip` (int, optional, default: 0): Number of items to skip
- `limit` (int, optional, default: 10): Maximum number of items to return
- `type` (string, optional): Filter by transaction type ("income" or "expense")
- `category` (string, optional): Filter by category
- `start_date` (string, optional): Filter by start date (ISO format)
- `end_date` (string, optional): Filter by end date (ISO format)

**Success Response** (200 OK):
```json
{
  "items": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Grocery Shopping",
      "amount": 50.00,
      "type": "expense",
      "category": "groceries",
      "transaction_date": "2023-12-15T14:30:00.000Z",
      "description": "Weekly groceries from local market",
      "created_at": "2023-12-15T14:30:00.000Z",
      "updated_at": "2023-12-15T14:30:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Salary",
      "amount": 3000.00,
      "type": "income",
      "category": "salary",
      "transaction_date": "2023-12-01T09:00:00.000Z",
      "description": "Monthly salary",
      "created_at": "2023-12-01T09:00:00.000Z",
      "updated_at": "2023-12-01T09:00:00.000Z"
    }
  ],
  "total": 2,
  "skip": 0,
  "limit": 10
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

### Get Transaction by ID

**Endpoint**: `GET /api/v1/transactions/{id}`

**Description**: Get details of a specific transaction.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Transaction ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Grocery Shopping",
  "amount": 50.00,
  "type": "expense",
  "category": "groceries",
  "transaction_date": "2023-12-15T14:30:00.000Z",
  "description": "Weekly groceries from local market",
  "created_at": "2023-12-15T14:30:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Transaction not found or doesn't belong to user

---

### Create Transaction

**Endpoint**: `POST /api/v1/transactions`

**Description**: Create a new transaction.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Grocery Shopping",
  "amount": 50.00,
  "type": "expense",
  "category": "groceries",
  "transaction_date": "2023-12-15T14:30:00.000Z",
  "description": "Weekly groceries from local market"
}
```

**Validation**:
- `title`: String, required, max 100 chars
- `amount`: Number, required, min 0.01
- `type`: String, required, must be "income" or "expense"
- `category`: String, required, max 50 chars
- `transaction_date`: DateTime, optional, defaults to current time
- `description`: String, optional, max 500 chars

**Success Response** (201 Created):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Grocery Shopping",
  "amount": 50.00,
  "type": "expense",
  "category": "groceries",
  "transaction_date": "2023-12-15T14:30:00.000Z",
  "description": "Weekly groceries from local market",
  "created_at": "2023-12-15T14:30:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `422 Unprocessable Entity`: Validation error

---

### Update Transaction

**Endpoint**: `PUT /api/v1/transactions/{id}`

**Description**: Update an existing transaction.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (int, required): Transaction ID

**Request Body**:
```json
{
  "title": "Updated Grocery Shopping",
  "amount": 55.00,
  "type": "expense",
  "category": "groceries",
  "transaction_date": "2023-12-15T14:30:00.000Z",
  "description": "Updated weekly groceries"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated Grocery Shopping",
  "amount": 55.00,
  "type": "expense",
  "category": "groceries",
  "transaction_date": "2023-12-15T14:30:00.000Z",
  "description": "Updated weekly groceries",
  "created_at": "2023-12-15T14:30:00.000Z",
  "updated_at": "2023-12-15T15:00:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Transaction not found or doesn't belong to user
- `422 Unprocessable Entity`: Validation error

---

### Delete Transaction

**Endpoint**: `DELETE /api/v1/transactions/{id}`

**Description**: Delete a transaction.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Transaction ID

**Success Response** (204 No Content):
```
(Empty response body)
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Transaction not found or doesn't belong to user

---

## 4. Budgets

### List Budgets

**Endpoint**: `GET /api/v1/budgets`

**Description**: Get a list of budgets for the authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `category` (string, optional): Filter by category

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "category": "groceries",
    "limit_amount": 300.00,
    "current_month": "2023-12",
    "spent_amount": 50.00,
    "created_at": "2023-12-01T09:00:00.000Z",
    "updated_at": "2023-12-15T14:30:00.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "category": "entertainment",
    "limit_amount": 150.00,
    "current_month": "2023-12",
    "spent_amount": 25.00,
    "created_at": "2023-12-01T09:00:00.000Z",
    "updated_at": "2023-12-15T14:30:00.000Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

### Get Budget by ID

**Endpoint**: `GET /api/v1/budgets/{id}`

**Description**: Get details of a specific budget.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Budget ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "category": "groceries",
  "limit_amount": 300.00,
  "current_month": "2023-12",
  "spent_amount": 50.00,
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Budget not found or doesn't belong to user

---

### Create Budget

**Endpoint**: `POST /api/v1/budgets`

**Description**: Create a new budget.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "category": "groceries",
  "limit_amount": 300.00,
  "current_month": "2023-12"
}
```

**Validation**:
- `category`: String, required, max 50 chars
- `limit_amount`: Number, required, min 0.01
- `current_month`: String, required, format YYYY-MM

**Success Response** (201 Created):
```json
{
  "id": 1,
  "user_id": 1,
  "category": "groceries",
  "limit_amount": 300.00,
  "current_month": "2023-12",
  "spent_amount": 0.00,
  "created_at": "2023-12-15T14:30:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `422 Unprocessable Entity`: Validation error

---

### Update Budget

**Endpoint**: `PUT /api/v1/budgets/{id}`

**Description**: Update an existing budget.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (int, required): Budget ID

**Request Body**:
```json
{
  "category": "groceries",
  "limit_amount": 350.00,
  "current_month": "2023-12"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "category": "groceries",
  "limit_amount": 350.00,
  "current_month": "2023-12",
  "spent_amount": 50.00,
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T15:00:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Budget not found or doesn't belong to user
- `422 Unprocessable Entity`: Validation error

---

### Delete Budget

**Endpoint**: `DELETE /api/v1/budgets/{id}`

**Description**: Delete a budget.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Budget ID

**Success Response** (204 No Content):
```
(Empty response body)
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Budget not found or doesn't belong to user

---

## 5. Pots (Savings Goals)

### List Pots

**Endpoint**: `GET /api/v1/pots`

**Description**: Get a list of savings pots for the authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Vacation Fund",
    "target_amount": 2000.00,
    "current_balance": 500.00,
    "theme_color": "#4285F4",
    "created_at": "2023-12-01T09:00:00.000Z",
    "updated_at": "2023-12-15T14:30:00.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "name": "Emergency Fund",
    "target_amount": 5000.00,
    "current_balance": 1200.00,
    "theme_color": "#EA4335",
    "created_at": "2023-11-15T10:00:00.000Z",
    "updated_at": "2023-12-15T14:30:00.000Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

### Get Pot by ID

**Endpoint**: `GET /api/v1/pots/{id}`

**Description**: Get details of a specific pot.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Pot ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "current_balance": 500.00,
  "theme_color": "#4285F4",
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Pot not found or doesn't belong to user

---

### Create Pot

**Endpoint**: `POST /api/v1/pots`

**Description**: Create a new savings pot.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "theme_color": "#4285F4"
}
```

**Validation**:
- `name`: String, required, max 100 chars
- `target_amount`: Number, required, min 0.01
- `theme_color`: String, optional, valid hex color

**Success Response** (201 Created):
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "current_balance": 0.00,
  "theme_color": "#4285F4",
  "created_at": "2023-12-15T14:30:00.000Z",
  "updated_at": "2023-12-15T14:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `422 Unprocessable Entity`: Validation error

---

### Update Pot

**Endpoint**: `PUT /api/v1/pots/{id}`

**Description**: Update an existing pot.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (int, required): Pot ID

**Request Body**:
```json
{
  "name": "Updated Vacation Fund",
  "target_amount": 2500.00,
  "theme_color": "#34A853"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Updated Vacation Fund",
  "target_amount": 2500.00,
  "current_balance": 500.00,
  "theme_color": "#34A853",
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T15:00:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Pot not found or doesn't belong to user
- `422 Unprocessable Entity`: Validation error

---

### Deposit to Pot

**Endpoint**: `PATCH /api/v1/pots/{id}/deposit`

**Description**: Deposit funds to a pot.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (int, required): Pot ID

**Request Body**:
```json
{
  "amount": 100.00
}
```

**Validation**:
- `amount`: Number, required, min 0.01

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "current_balance": 600.00,
  "theme_color": "#4285F4",
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T15:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Pot not found or doesn't belong to user
- `422 Unprocessable Entity`: Validation error

---

### Withdraw from Pot

**Endpoint**: `PATCH /api/v1/pots/{id}/withdraw`

**Description**: Withdraw funds from a pot.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (int, required): Pot ID

**Request Body**:
```json
{
  "amount": 50.00
}
```

**Validation**:
- `amount`: Number, required, min 0.01, max current_balance

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Vacation Fund",
  "target_amount": 2000.00,
  "current_balance": 550.00,
  "theme_color": "#4285F4",
  "created_at": "2023-12-01T09:00:00.000Z",
  "updated_at": "2023-12-15T15:30:00.000Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Pot not found or doesn't belong to user
- `400 Bad Request`: Insufficient funds
- `422 Unprocessable Entity`: Validation error

---

### Delete Pot

**Endpoint**: `DELETE /api/v1/pots/{id}`

**Description**: Delete a pot.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `id` (int, required): Pot ID

**Success Response** (204 No Content):
```
(Empty response body)
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Pot not found or doesn't belong to user

---

## 6. Dashboard

### Get Dashboard Overview

**Endpoint**: `GET /api/v1/dashboard/overview`

**Description**: Get comprehensive financial overview for the authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "balance": {
    "total_income": 3000.00,
    "total_expenses": 500.00,
    "net_balance": 2500.00
  },
  "recent_transactions": [
    {
      "id": 1,
      "title": "Grocery Shopping",
      "amount": 50.00,
      "type": "expense",
      "category": "groceries",
      "transaction_date": "2023-12-15T14:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Salary",
      "amount": 3000.00,
      "type": "income",
      "category": "salary",
      "transaction_date": "2023-12-01T09:00:00.000Z"
    }
  ],
  "budgets": [
    {
      "category": "groceries",
      "limit": 300.00,
      "spent": 50.00,
      "remaining": 250.00,
      "progress": 16.67
    },
    {
      "category": "entertainment",
      "limit": 150.00,
      "spent": 25.00,
      "remaining": 125.00,
      "progress": 16.67
    }
  ],
  "pots": [
    {
      "id": 1,
      "name": "Vacation Fund",
      "target": 2000.00,
      "current": 500.00,
      "progress": 25.00,
      "theme_color": "#4285F4"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

## 7. Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "detail": "Error message"
}
```

### Common Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 Bad Request | Validation Error | Invalid request data |
| 401 Unauthorized | Authentication Error | Invalid or missing token |
| 403 Forbidden | Authorization Error | User not authorized |
| 404 Not Found | Not Found | Resource not found |
| 422 Unprocessable Entity | Validation Error | Data validation failed |
| 500 Internal Server Error | Server Error | Unexpected server error |

---

## 8. Pagination

### Pagination Parameters

Many list endpoints support pagination:

- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum number of items to return (default: 10, max: 100)

### Pagination Response Format

```json
{
  "items": [...],
  "total": 100,
  "skip": 0,
  "limit": 10
}
```

---

## 9. Authentication Flow

### Step-by-Step Authentication

```
1. User registers: POST /api/v1/auth/register
   └── Returns user object

2. User logs in: POST /api/v1/auth/login
   └── Returns JWT token

3. User includes token in subsequent requests:
   Authorization: Bearer <token>

4. Server validates token and extracts user_id

5. User can access protected endpoints
```

### Token Usage Example

```bash
# Get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"

# Use token
curl -X GET http://localhost:8000/api/v1/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## API Documentation Access

The API provides interactive documentation:

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

---

*Documentation for Finance App Backend v1.0.0*
