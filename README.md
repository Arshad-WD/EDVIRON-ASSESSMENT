# School Payment Management System

A **School Payment Management System** to manage transactions, track payments, and analyze revenue for educational institutions.  
The system is built with a **MERN stack**: MongoDB, Express.js, React, Node.js, and uses **JWT-based authentication**, **payment gateways**, and **analytics dashboards**.

---

## 🛠 Installation & Setup

Follow these steps to clone and set up the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Arshad-WD/EDVIRON-ASSESSMENT.git
cd EDVIRON-ASSESSMENT

```

### 2️⃣ Environment Variables

Both frontend and backend require environment variables.

***Backend .env***
```
$ cd BACKEND
$ cp .env.example .env
```
Edit .env and add your values:

```bash
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Payment Gateway
PAYMENT_API_KEY=your_payment_api_key
PG_KEY=your_payment_gateway_key

# Node
NODE_ENV=development
PORT=5000
```

**Frontend .env**
```
$ cd ../FRONTEND
$ cp .env.example .env
```
Edit .env and update API URLs if needed:
```
 VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Install Dependencies
***Backend***

cd ../BACKEND

    $ npm install

***Frontend***
```
$ cd ../FRONTEND
$ npm install
```
### 4️⃣ Run the Servers
**Backend**

    $ cd ../BACKEND
    $ node server.js

The backend will run on http://localhost:5000.

**Frontend**

cd ../FRONTEND

    $ npm run dev

The frontend will typically run on http://localhost:5173.

## Features
User Authentication: Register, login, logout with JWT and cookie support.

Payment Management: Create payments, track transaction status, and handle webhook updates from payment gateways.

Analytics: View monthly revenue and transaction status summaries.

Transaction Management: Paginated and filtered transaction listing by status or school.

Security: Secure HTTP headers, CORS, HMAC webhook verification.

Frontend: React + Vite + TailwindCSS.

## 📁 Project Structure
The project is divided into Frontend and Backend folders.

**Frontend**
```
/FRONTEND
├── node_modules/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── .env
├── .env.example
├── .gitignore
├── .eslintrc.cjs
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

**Backend**
```
/BACKEND
├── config/
│   └── db.js
├── controllers/
│   ├── analytics.controller.js
│   ├── auth.controller.js
│   ├── payment.controller.js
│   └── transaction.controller.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Order.js
│   ├── OrderStatus.js
│   ├── User.js
│   └── WebhookLog.js
├── routes/
│   ├── analytics.route.js
│   ├── auth.route.js
│   ├── payment.route.js
│   └── transactions.route.js
├── utils/
│   └── verfySignature.js
├── app.js
├── server.js
├── package.json
└── .env
```

## 🔹 Backend Explanation
1. Database Models
   
        User: Stores username and password (hashed using bcrypt).

        Order: Represents a payment order containing school_id, student_info, and gateway_name.

        OrderStatus: Tracks payment status (pending, success, failed) and transaction details.

        WebhookLog: Logs incoming webhook payloads for auditing purposes.

2. Authentication
        
        Register: Creates a new user with hashed password.

        Login: Validates credentials and issues a JWT token stored in an httpOnly cookie.

        Logout  : Clears the authentication cookie.

        Me: Returns the authenticated user’s details (excluding password).

        Middleware (authMiddleware): Verifies JWT token on protected routes.

3. Payments

        Create Payment (POST /api/payment/create-payment):

        Accepts school_id, student_info, order_amount, and optional gateway_name.

        Creates a local order record.

        Signs payload with PAYMENT_API_KEY and sends it to payment gateway (mocked).

        Initializes OrderStatus with pending status.

        Webhook (POST /api/payment/webhook):

        Validates incoming webhook with HMAC signature.

        Updates transaction status and stores payload in WebhookLog.

4. Transactions

        Get Transactions (GET /api/transactions): Paginated, sortable, and filterable.

        Get Transactions by School (GET /api/transactions/school/:schoolId).

        Get Transaction Status (GET /api/transaction-status/:custom_order_id).

        Update Transaction (PUT /api/transactions/:id).

5. Analytics

        Get Payments Analytics (GET /api/analytics/payments):

        Aggregates monthly revenue for successful payments.

        Aggregates monthly status counts (success, failed, pending).

## 🔹 Security & Middleware
```Helmet: Secures HTTP headers.

CORS: Restricts origins to frontend URLs.

Morgan: Logs HTTP requests.

Webhook Signature Verification: Ensures payload integrity.

JWT Auth: Protects sensitive API endpoints.
```
### 🔹 Environment Variables
```
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Payment Gateway
PG_KEY=your_payment_gateway_key
PAYMENT_API_KEY=your_payment_api_key

# Node
NODE_ENV=development
PORT=5000
```

# Frontend
```
VITE_API_URL=http://localhost:5000/api
```

### ✅ Notes
Make sure MongoDB is running and accessible using the URI in .env.

Use secure keys for JWT_SECRET and PAYMENT_API_KEY in production.

CORS and allowed origins are configured in the backend app.js.

Payment API calls are currently mocked for demonstration.

All dates and times are stored in UTC.

This README now fully explains setup, environment configuration, project structure, features, backend logic, security, and running both frontend and backend.