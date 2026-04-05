# Finance Data Processing and Access Control Backend

> **Live API Base URL:** [https://capitalguard-backend.onrender.com]

## Overview
This is a Node.js and Express backend for a finance dashboard system. It supports storing financial records, managing users with Role-Based Access Control (RBAC), and generating summary aggregations for a dashboard. Data is persisted in MongoDB.

## Features
- **User and Role Management:** Create, view, and update users. Roles included are `Viewer`, `Analyst`, and `Admin`.
- **Financial Records:** CRUD operations for financial records. Supports pagination and filtering.
- **Dashboard Summaries:** Analytics endpoints pulling aggregation pipelines directly from MongoDB (e.g. Total Income, Total Expenses, category summaries, monthly trends, recent activity).
- **Access Control:** JWT-based robust authentication with role verification at the route level.
- **Validation:** Request body validation using Joi.
- **Error Handling:** Standardized error responses across all endpoints.

## Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: Authentication
- `bcryptjs`: Password hashing
- `joi`: Data validation
- `dotenv`: Environment variables

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (e.g., MongoDB Atlas or local MongoDB)

### Setup
1. Clone this repository or use the directory via terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` and fill out the details:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/finance_dev
   JWT_SECRET=Finance
   ```
4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

## 🔑 Demo Accounts for Reviewers
To easily test the Role-Based Access Control logic without needing database access, you can log in using the following pre-configured demo accounts. The password for all accounts is `123456`:

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@test.com` |
| **Analyst** | `analyst@test.com` |
| **Viewer** | `viewer@test.com` |

## Role Permissions Summary

Here is a breakdown of exactly which routes each role can access:

### 1. Viewer
The `Viewer` is the default role upon registration with read-only access to individual records.
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/records` (View all records)
- `GET /api/records/:id` (View single record)

### 2. Analyst
The `Analyst` includes everything a Viewer has, plus access to aggregated data summaries.
- *...All Viewer Routes*
- `GET /api/dashboard/summary` (View financial analytics)

### 3. Admin
The `Admin` has unrestricted access, including data mutation and user management.
- *...All Analyst Routes*
- `POST /api/records` (Create a record)
- `PUT /api/records/:id` (Update a record)
- `DELETE /api/records/:id` (Delete a record)
- `GET /api/users` (List all users)
- `PUT /api/users/:id/role` (Update user role/status)

## Postman / API Testing

> **💡 Quick Start:** I have included an exported Postman Collection in this repository (`CapitalGuard_Postman_Collection.json`). Simply import this file into your Postman app, and you will instantly have all the pre-configured routes, bodies, and headers ready to test!

### Authentication
- `POST /api/auth/register` (Register - standard users become viewers)
- `POST /api/auth/login` (Login -> returns JWT)

> Make sure to pass `Authorization: Bearer <your_token>` as a header for all private routes.

### Users (Requires `Admin`)
- `GET /api/users` 
- `PUT /api/users/:id/role` 
  - Body: `{ "role": "Admin", "status": "Active" }` (Valid Roles: Viewer, Analyst, Admin)

### Records
- `GET /api/records` (Viewer, Analyst, Admin. Supports `?page=1&limit=10&sort=-amount` and filters `?amount[gte]=500`)
- `GET /api/records/:id`
- `POST /api/records` (Admin only)
  - Body: `{ "amount": 1000, "type": "income", "category": "Salary", "date": "2023-10-01" }`
- `PUT /api/records/:id` (Admin only)
- `DELETE /api/records/:id` (Admin only)

### Dashboard (Requires `Analyst` or `Admin`)
- `GET /api/dashboard/summary` (Returns total income, expenses, category totals, etc.)

## Project Structure
- `/src/models` - Mongoose schemas (User, Record)
- `/src/controllers` - Business logic and function handling
- `/src/routes` - Express endpoint mappings
- `/src/middlewares` - Auth, Role, Error Handling, Validation
- `/src/config` - DB Config
- `/src/app.js` - Express API setup
- `/src/server.js` - Database connection and app bootstrap
