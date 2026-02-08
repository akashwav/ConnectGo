# 💬 ConnectGo - Real-Time Chat Application

**A modern, full-stack messaging platform built for seamless communication across web and mobile devices.**

---

## 📖 Table of Contents

* [About The Project](https://www.google.com/search?q=%23-about-the-project)
* [Key Features](https://www.google.com/search?q=%23-key-features)
* [Technology Stack](https://www.google.com/search?q=%23-technology-stack)
* [Project Structure](https://www.google.com/search?q=%23-project-structure)
* [Setup and Installation](https://www.google.com/search?q=%23-setup-and-installation)
* [Mobile Build (Android)](https://www.google.com/search?q=%23-mobile-build-android)
* [Usage](https://www.google.com/search?q=%23-usage)
* [License](https://www.google.com/search?q=%23-license)
* [Acknowledgements](https://www.google.com/search?q=%23-acknowledgements)

---

## 🎯 About The Project

**ConnectGo** is a robust, real-time chat application designed to bridge the gap between desktop and mobile communication. Built with the MERN stack and powered by Socket.io, it offers instant messaging capabilities with a focus on user experience, security, and cross-platform accessibility.

The project features a responsive web interface that adapts to any screen size and includes a native Android build powered by Capacitor. Whether you are on your laptop or your phone, ConnectGo keeps you connected with friends and colleagues instantly.

---

## ✨ Key Features

* **Real-Time Messaging:** Instant message delivery using  Socket.io with zero latency.
* **Cross-Platform Support:** Fully responsive web app + Native Android APK support via Capacitor.
* **Secure Authentication:** JWT-based authorization with secure login and registration.
* **Smart Notifications:** Browser push notifications for incoming messages when the app is in the background.
* **Modern UI/UX:** Clean, "WhatsApp-like" interface built with Tailwind CSS, featuring glassmorphism effects and smooth transitions.
* **Group & One-on-One Chats:** Support for private conversations and group chat functionality.
* **Persistent Login:** "Remember Me" functionality to keep users logged in across sessions.
* **Typing Indicators & Read Status:** Visual cues for a dynamic chatting experience.

---

## 🛠️ Technology Stack

This project was built using the following technologies:

### **Frontend**

* **React.js (Vite):** For building a fast, interactive user interface.
* **Tailwind CSS:** For utility-first, responsive styling.
* **Chakra UI:** For pre-built accessible components.
* **Capacitor:** For converting the web app into a native Android APK.

### **Backend**

* **Node.js & Express:** For the scalable server-side architecture.
* **Socket.io:** For enabling bi-directional, real-time communication.
* **MongoDB & Mongoose:** For flexible, NoSQL data storage.
* **JWT (JSON Web Tokens):** For secure user authentication.

### **Deployment**

* **Frontend:** Hosted on [Vercel](https://www.google.com/search?q=https://vercel.com).
* **Backend:** Hosted on [Render](https://www.google.com/search?q=https://render.com).

---

## 📁 Project Structure

The repository is organized into a client-server architecture:

```text
ConnectGo/
├── chat-server/             # Backend (Node.js/Express)
│   ├── config/              # Database configuration
│   ├── controllers/         # Request logic
│   ├── models/              # MongoDB Schemas
│   ├── routes/              # API Routes
│   └── index.js             # Entry point
│
├── my-chat-app/             # Frontend (React/Vite)
│   ├── android/             # Native Android project files
│   ├── src/
│   │   ├── components/      # Reusable UI components (Sidebar, ChatWindow)
│   │   ├── context/         # React Context API for state management
│   │   ├── pages/           # Main application pages
│   │   └── config.js        # Environment configuration
│   └── capacitor.config.ts  # Mobile build config
│
└── README.md                # Project documentation

```

---

## ⚙️ Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Prerequisites

Ensure you have **Node.js** and **Git** installed on your system. For Android builds, you will need **Android Studio**.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/ConnectGo.git
cd ConnectGo

```

### 3. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd chat-server
npm install

```

Create a `.env` file in `chat-server` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

```

Start the server:

```bash
npm start

```

### 4. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd my-chat-app
npm install

```

Configure the API URL in `src/config.js`:

```javascript
// Set to true for production, false for localhost
const IS_PRODUCTION = false; 

```

Start the client:

```bash
npm run dev

```

---

## 📱 Mobile Build (Android)

To generate the Android APK using Capacitor:

1. **Build the React project:**
```bash
cd my-chat-app
npm run build

```


2. **Sync with Capacitor:**
```bash
npx cap sync

```


3. **Open in Android Studio:**
```bash
npx cap open android

```


4. **Build APK:** inside Android Studio, go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

---

## ▶️ Usage

1. **Register/Login:** Create a new account or log in with existing credentials.
2. **Search Users:** Use the sidebar search to find other users by name or email.
3. **Start Chatting:** Click on a user to open the chat window and send real-time messages.
4. **Notifications:** Allow browser permissions to receive notifications when you are on other tabs.

---

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.

---

## 👏 Acknowledgements

* [Socket.io Documentation](https://www.google.com/search?q=https://socket.io/docs/v4/)
* [Tailwind CSS](https://www.google.com/search?q=https://tailwindcss.com/)
* [Render & Vercel](https://www.google.com/search?q=https://render.com/) for hosting support.
* Special thanks to the open-source community for the amazing tools used in this project.

---

### **Made with ❤️ by Akash**
