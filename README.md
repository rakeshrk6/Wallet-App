# Wallet Application

A simple wallet application that allows users to manage their wallet balance, track transactions, and perform transfers between users. The application includes features like user authentication, adding and withdrawing funds, and viewing transaction history.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Styling**: Material UI (for frontend)

## Setup and Run Instructions

### Prerequisites
Before starting, ensure you have the following installed:
- Node.js (v14 or above)
- npm or yarn
- MongoDB (either locally or using a cloud service like MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/rakeshrk6/wallet.git
cd wallet
```

### 2. Install dependencies
For both frontend and backend, run the following:

#### Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

#### Frontend
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Set up environment variables
Create a `.env` file in both the **backend** and **frontend** directories and configure the following:

#### Backend `.env`
```env
ATLAS_URL=
ACCESS_TOKEN_PRIVATE_KEY=
REFRESH_TOKEN_PRIVATE_KEY=
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env`
```env
VITE_BACKEND_URL=http://localhost:8000
```

### 4. Start the application

#### Backend
Run the backend server:
```bash
cd backend
node index.js
```

#### Frontend
Run the frontend server:
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:5173` (Frontend) and the API at `http://localhost:8000` (Backend).
