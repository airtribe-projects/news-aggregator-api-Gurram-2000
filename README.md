
# 📰 News Aggregator App

## 📌 Project Overview

The News Aggregator App is a Node.js-based application that allows users to register, log in, save their topic preferences, and fetch personalized news articles based on their interests. The backend is built using Express.js, MongoDB (with Mongoose), and integrates third-party news APIs.

---

## ⚙️ Installation Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
NEWS_API_KEY=your_news_api_key
```

Replace placeholders with your actual credentials.

---

## 🚀 Running the Server

```bash
npm start
```

---

## 📡 API Endpoint Documentation

### 🧑‍💼 User Authentication

#### `POST /signup`

- **Description:** Registers a new user.
- **Body:**  
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### `POST /login`

- **Description:** Logs in a user and returns a JWT token.
- **Body:**  
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

- **Response:**  
```json
{
  "token": "<JWT_TOKEN>"
}
```

---

### ⚙️ Preferences

#### `GET /preferences`

- **Description:** Fetches user's saved preferences.
- **Headers:**  
`Authorization: Bearer <JWT_TOKEN>`

#### `POST /preferences`

- **Description:** Updates user preferences.
- **Headers:**  
`Authorization: Bearer <JWT_TOKEN>`

- **Body:**  
```json
{
  "topics": ["technology", "sports"],
  "language": "en"
}
```

---

### 📰 News

#### `GET /news`

- **Description:** Returns curated news based on user preferences.
- **Headers:**  
`Authorization: Bearer <JWT_TOKEN>`

---

## 🧪 Run Tests

```bash
npm test
```

---

## 🧰 Technologies Used

- Node.js
- Express.js
- JWT for Authentication
- External News API
- Tap & Supertest for Testing

---

## 📄 License

MIT License
