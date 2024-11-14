# Booking App Server

This repository contains the backend server for a booking app, built with Node.js and Express. It provides a REST API to handle various booking functionalities such as managing hotels, rooms, users, and transactions.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Author](#author)

## Features

- User registration, login, and management
- Hotel and room management with availability checks
- Transaction management for room bookings
- Separate routes for admin-specific functions
- Secure password storage and authentication using JWT
- Admin control over hotel and room records

## Technologies

- **Node.js** - JavaScript runtime environment
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - Authentication using JSON Web Tokens
- **bcrypt.js** - Password hashing
- **Render** (or alternative) - Server deployment

## Setup

1. Clone this repository:
    ```bash
    git clone https://github.com/thondFX20279/booking-app-server.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root directory and add the necessary environment variables (see below).
4. Start the server:
    ```bash
    npm start
    ```
   The server will run on `http://localhost:5000` by default.

## Environment Variables

The following environment variables are required:

- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Port for the server (default is 5000)

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login and receive a JWT token
- **POST** `/api/auth/login-admin` - Admin login

### Users

- **GET** `/api/users` - Retrieve a list of all users (admin only)
- **GET** `/api/users/current` - Retrieve current logged-in user profile
- **GET** `/api/users/:userId` - Retrieve user by ID
- **PUT** `/api/users/:userId` - Update user details
- **DELETE** `/api/users/:userId` - Delete a user

### Hotels

- **GET** `/api/hotels` - Retrieve a list of hotels with filtering options
- **GET** `/api/hotels/:hotelId` - Retrieve a hotel by ID
- **POST** `/api/hotels` - Create a new hotel (admin only)
- **PUT** `/api/hotels/:hotelId` - Update a hotel (admin only)
- **DELETE** `/api/hotels/:hotelId` - Delete a hotel (admin only)
- **GET** `/api/hotels/countByCity` - Count hotels by city
- **GET** `/api/hotels/countByType` - Count hotels by type
- **GET** `/api/hotels/top-rated` - Get top-rated hotels

### Rooms

- **GET** `/api/rooms` - Retrieve a list of all rooms
- **POST** `/api/rooms/:hotelId` - Create a new room in a specified hotel (admin only)
- **GET** `/api/rooms/:roomId` - Retrieve a room by ID
- **PUT** `/api/rooms/:roomId` - Update room details (admin only)
- **DELETE** `/api/rooms/:roomId` - Delete a room (admin only)

### Transactions

- **GET** `/api/transactions` - Retrieve a list of all transactions (with optional limit)
- **POST** `/api/transactions` - Create a new booking transaction
- **GET** `/api/transactions/user/:userId` - Retrieve all transactions for a specific user

### Room Availability

- **GET** `/api/hotels/:hotelId/available-rooms` - Check available rooms in a hotel based on dates

## Error Handling

All endpoints use a custom error handling middleware. Errors are returned in JSON format with the following structure:
```json
{
  "status": 400,
  "message": "Error message here",
  "success": "true",
  "stack": "error detail"
}
