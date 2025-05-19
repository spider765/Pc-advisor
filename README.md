
THIS is the back end
Here's a clean and professional documentation snippet you can include in your `README.md` or docs for your project:

---

## 🚀 Getting Started with Smart PC Build Advisor

Welcome to the **Smart PC Build Advisor** project! This app helps users generate personalized PC builds based on their budget, brand preferences, and use cases.

### 📦 Project Structure

This project consists of two main parts:

* **Rails API (`kluster`)** – Powers the backend and generates the smart PC builds.
* **React Frontend** – Handles user input and displays build results.

---

## 🖥️ Local Development Setup

Follow these steps to run both servers locally:

### 1. Clone Both Repositories

```bash
# Clone the Rails API
git clone https://github.com/your-username/kluster.git

# Clone the React frontend
git clone https://github.com/your-username/pc-build-advisor-frontend.git
```

### 2. Run the Rails API

Navigate to the API folder (`kluster`) and run:

```bash
bundle install
rails db:setup
rails server -b 0.0.0.0 -p 4000
```

> This will start the backend server at: `http://localhost:4000`

### 3. Run the React Frontend

Navigate to the frontend folder (`pc-build-advisor-frontend`) and run:

```bash
npm install
npm start
```

> This will start the frontend server at: `http://localhost:3000`

---

## 🔗 API Base URL

All API requests in the frontend are sent to:

```
http://localhost:4000/api
```

This is powered by the `kluster` Rails API.

---

## 🧠 Notes

* Ensure both servers are running at the same time.
* If you're using Docker, consider exposing the backend on port 4000 and the frontend on port 3000.
* Use `.env` files or environment variables to manage base URLs in production.

---

Let me know if you'd like to add Docker, deploy instructions, or live demo links!
