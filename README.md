<h1 align="center">✨ Fullstack Chat & Video Calling App ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

Highlights:

- 🌐 Real-time Messaging with LiveKit Data Channels
- 📹 1-on-1 and Group Video Calls with LiveKit
- 🔐 JWT Authentication & Protected Routes
- 🌍 Language Exchange Platform with 32 Unique UI Themes
- ⚡ Tech Stack: React + Express + MongoDB + TailwindCSS + TanStack Query
- 🧠 Global State Management with Zustand
- 🚨 Error Handling (Frontend & Backend)
- 🚀 Self-Hosted with LiveKit (No third-party costs!)
- 🎯 Built with Scalable Technologies
- ⏳ And much more!

---

## 🧪 .env Setup

### Backend (`/backend`)

```
PORT=5001
MONGO_URI=your_mongo_uri

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-server.com

JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### Frontend (`/frontend`)

```
VITE_LIVEKIT_URL=wss://your-livekit-server.com
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎥 LiveKit Self-Hosted Setup

This app uses **LiveKit** for real-time communication. You can self-host LiveKit using Docker:

```yaml
version: "3.8"
services:
  livekit:
    image: livekit/livekit-server:latest
    command: --config /etc/livekit.yaml
    restart: unless-stopped
    ports:
      - "7880:7880"
      - "7881:7881"
      - "7882:7882/udp"
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml
```

Or use Dokploy/Coolify for easy deployment!
