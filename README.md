# socket.io-application
# Socket.io Chat Application

A real-time chat application built using Node.js, Express.js, PostgreSQL, JWT authentication, and Socket.IO.

## Features

- User registration and login
- JWT-based authentication
- JWT cookie authentication
- Create chat rooms
- View available rooms
- Join chat rooms
- Store room members in PostgreSQL
- Send and receive messages in real time
- Store messages in PostgreSQL
- Load previous messages
- Socket.IO room-based messaging
- REST APIs for authentication, rooms, and messages

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT
- Password Hashing: bcrypt
- Real-time Communication: Socket.IO
- Database Driver: pg

## Project Structure

socket.io-application/
│
├── config/
│   └── db.js
│
├── controller/
│   ├── authController.js
│   ├── roomController.js
│   └── messageController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── roomRoutes.js
│   └── messageRoutes.js
│
├── services/
│   └── ...
│
├── public/
│   └── index.html
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js

## Database

The application uses PostgreSQL.

### Users

Stores registered users.

- id
- username
- email
- password

### Rooms

Stores chat rooms and their members.

- room_id
- name
- created_by
- users
- created_at

### Messages

Stores messages sent inside rooms.

- message_id
- room_id
- sender_id
- message
- created_at

## API Routes

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| GET | `/api/me` | Check JWT authentication |

### Rooms

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/create-room` | Create a new room |
| POST | `/api/join-room` | Join a room |
| GET | `/api/get-rooms` | Get available rooms |

### Messages

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/:roomId/messages` | Send a message |
| GET | `/api/:roomId/messages` | Get previous messages |

## Real-Time Messaging

When a user joins a room:

User
↓
Socket.IO
↓
join-room
↓
room-6

When a message is sent:

Frontend
↓
POST /api/:roomId/messages
↓
Express Controller
↓
PostgreSQL
↓
Socket.IO
↓
io.to("room-6").emit()
↓
All users in the room

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
