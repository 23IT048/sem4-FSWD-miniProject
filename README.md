# MERN Ticket App

A full-stack web application for buying and selling Train / Bus tickets amongst peers built with the MERN stack (MongoDB, Express, React, Node.js).

## 📋 Features

- **User Authentication**: Secure login and registration
- **Create Ticket Listings**: List tickets you want to sell with details like location, time, and price
- **Browse Ticket Listings**: View available tickets and request to purchase
- **Dashboard**: Manage your tickets, requests, and view tickets you've requested
- **Request Management**: Accept or reject purchase requests from other users
- **Real-time Status Updates**: Track the status of tickets (Available, Under Discussion, Sold)

## 🔧 Technologies Used

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
```bash
git clone "https://github.com/23IT048/sem4-FSWD-miniProject.git"
cd mern-ticket-app
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

### Running the Application

1. Start the server
```bash
cd server
npm start
```

2. Start the client
```bash
cd ../client
npm start
```

The application should now be running on `http://localhost:5173`

## 📱 Application Structure

### User Flow
1. Register/Login to the application
2. Browse available tickets or create a new ticket listing
3. Request tickets you want to purchase
4. Manage incoming requests for your tickets (accept/reject)
5. View the status of your requests and tickets

### Key Pages
- **Home**: Landing page with app introduction
- **Login/Register**: User authentication
- **Browse Openings**: View all available tickets
- **Create Opening**: Create a new ticket listing
- **User Dashboard**: View and manage your tickets and requests
- **Edit Ticket**: Update or delete your tickets

## 💻 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user and receive JWT token

### Tickets
- `GET /tickets` - Get all available tickets
- `GET /tickets/:id` - Get a specific ticket by ID
- `POST /tickets` - Create a new ticket listing
- `PUT /tickets/:id` - Update a ticket
- `DELETE /tickets/:id` - Delete a ticket

### Requests
- `POST /tickets/:id/request` - Request to purchase a ticket
- `POST /tickets/:id/cancel-request` - Cancel a purchase request
- `POST /tickets/:id/accept-request` - Accept a purchase request
- `POST /tickets/:id/reject-request` - Reject a purchase request

### User Dashboard
- `GET /tickets/my-tickets` - Get tickets created by the logged-in user
- `GET /tickets/requested-tickets` - Get tickets requested by the logged-in user
- `GET /tickets/incoming-requests` - Get incoming requests for user's tickets

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Ticket Model
```javascript
{
  startLocation: String,
  endLocation: String,
  departureTime: Date,
  arrivalTime: Date,
  price: Number,
  contactNumber: String,
  status: String (available, under_discussion, sold),
  createdBy: ObjectId (ref: User),
  requests: [
    {
      userId: ObjectId (ref: User),
      status: String (pending, accepted, rejected)
    }
  ]
}
```

## 🔐 Authentication Flow

1. User registers with email, username, and password
2. Password is hashed using bcrypt before storage
3. On login, server validates credentials and issues a JWT token
4. Client stores the token in localStorage
5. Protected routes require valid JWT in Authorization header

## 🎨 UI Features

- Responsive design for desktop and mobile devices
- Dark/light mode toggle
- Status indicators for tickets (color-coded for easy recognition)
- Intuitive dashboard layout for managing tickets and requests

## 🧪 Testing

To run tests:

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

## 🛣️ Future Enhancements

- Real-time notifications using Socket.io
- In-app messaging between buyers and sellers
- Payment integration for secure transactions
- Advanced search and filtering options
- User ratings and reviews system

## 📂 Project Structure

```
mern-ticket-app/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── utils/        # Utility functions
│       ├── App.js        # Main component
│       └── index.js      # Entry point
├── server/               # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
└── README.md             # Project documentation
```

## 👨‍💻 Development Team

- Created by 23IT048 from CHARUSAT.
