# Cactro Poll

Cactro Poll is a simple polling application built with Next.js, Prisma, and PostgreSQL. Users can create polls, vote, and manage authentication securely.

## Features
- User authentication (Signup & Login)
- Create polls with multiple options
- Vote on polls
- Retrieve poll results

## Tech Stack
- **Backend:** Next.js (API Routes)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Cookies using JWT (JSON Web Tokens)
- **Validation:** Zod
- **Encryption:** Bcrypt

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js
- PostgreSQL


## Prisma Schema
```prisma
// prisma/schema.prisma

model User{
  id Int @id @default(autoincrement())
  name String
  email String @unique
  password String
  polls Poll[]
}

model Poll{
  id Int @id @default(autoincrement())
  question String
  option String[]
  pollCount Int[] @default([0,0,0,0])
  userId Int
  user User @relation(fields: [userId], references: [id])
}
```

## API Endpoints

### User Authentication
#### Signup
**POST** `/api/user/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "msg": "user signed up!!"
}
```

#### Login
**POST** `/api/user/signin`
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "msg": "Login successful"
}
```

### Polls
#### Create Poll
**POST** `/api/poll`
```json
{
  "question": "What is your favorite programming language?",
  "option": ["JavaScript", "Python", "Rust", "Go"]
}
```
Response:
```json
{
  "msg": "poll created!!"
}
```

#### Get All Polls
**GET** `/api/poll`
Response:
```json
{
  "polls": [
    {
      "id": 1,
      "question": "Favorite language?",
      "option": ["JavaScript", "Python", "Rust", "Go"],
      "pollCount": [2, 5, 3, 1]
    }
  ]
}
```

#### Vote on a Poll
**PUT** `/api/poll/{pollId}`
```json
{
  "vote": 2
}
```
Response:
```json
{
  "msg": "poll voted!!"
}
```

#### Get Poll by ID
**GET** `/api/poll/{pollId}`
Response:
```json
{
  "poll": {
    "id": 1,
    "question": "Favorite language?",
    "option": ["JavaScript", "Python", "Rust", "Go"],
    "pollCount": [2, 5, 3, 1]
  }
}
```

## License
This project is licensed under the MIT License.

## Author
[Akshay Dhayal](https://github.com/akshaydhayal)

