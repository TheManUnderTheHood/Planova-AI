# Planova AI - AI-Powered Content Strategy Engine

**Planova AI** is a full-stack MERN application that turns creator goals into data-informed content strategies. It gathers trend and competitor signals from multiple sources, enriches them with AI analysis, and produces an actionable content calendar.

This tool moves beyond simple content generation by building a complete strategic blueprint, from understanding the target audience with AI-generated personas to laying out a day-by-day content calendar.

## ✨ Core Features

*   **🤖 AI Strategy Generation**: Enter an audience, topic, goal, and optional date range to generate a 30-day plan by default, or a customized plan of up to 90 days.
*   **📊 Evidence-Informed Planning**: Collects source data before generation, extracts trend keywords, and passes the relevant evidence to the LLM along with the creator's requirements.
*   **📈 Multi-Source Trend Analysis**: Aggregates YouTube, Twitter/X through GetXAPI, Reddit RSS, and AI-generated search-trend ideas, then adds AI sentiment labels.
*   **🕵️ Competitor Tracking**: Track YouTube channels, Twitter/X accounts, or RSS-enabled blogs. Recent posts are cached and analyzed for recurring themes and strategy.
*   **👤 AI Persona Generation**: Creates a concise audience persona covering demographics, motivations, pain points, and content preferences.
*   **🗓️ Interactive Content Calendar**: View the generated plan by month, edit titles and publishing details, change status, drag content between days, undo moves, and view AI rationales.
*   **🔎 Content Gap Analysis**: Compares competitor themes with the user's saved strategy topics to identify content opportunities.
*   **💡 Content Idea Bank**: Generate blog titles, YouTube ideas, tweet hooks, and short-form video scripts without creating a full strategy.
*   **📋 Saved Strategies**: Review, open, and delete previously generated strategies.
*   **🔐 User Authentication**: JWT-based registration and login protect user strategies and competitor data with ownership checks.
*   **⚡ Caching and Quota Reduction**: Uses Redis when configured, with an automatic in-memory fallback. External trend and competitor responses use a six-hour default cache.
*   **🛡️ API Protection**: Includes authenticated AI/data routes, request-size limits, input validation, endpoint rate limiting, SSRF protection for RSS URLs, structured errors, and a health endpoint.
*   **🌐 Google Sign-In**: Sign up or log in with Google through Google Identity Services, then use the same Planova JWT-protected workspace as password users.

## 🛠️ Technology Stack

| Layer        | Technology                                                                                                  |
| :----------- | :---------------------------------------------------------------------------------------------------------- |
| **Frontend** | React, React Router, Tailwind CSS, Axios, Chart.js, Framer Motion                                           |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, JWT                                                                 |
| **APIs**     | **OpenRouter API (Claude Sonnet 4.5)**, YouTube Data API v3, GetXAPI for Twitter/X, Reddit RSS             |
| **Caching**  | Redis Cloud or Redis-compatible server, with `node-cache` fallback                                        |

## ⚙️ Setup and Installation

To run this project locally, you will need to set up both the backend and frontend services.

### Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm
*   MongoDB Atlas Account or another MongoDB deployment
*   Optional Redis Cloud account or Redis-compatible server

### Google OAuth Setup

Google sign-in uses a Web application OAuth client and Google Identity Services:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project and configure the OAuth consent screen.
3. Create an OAuth client under **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
4. Choose **Web application** and add these authorized JavaScript origins:
	- `http://localhost:5173`
	- Your deployed frontend origin, such as `https://app.example.com`
5. Put the same client ID in both backend and frontend environment variables:

```env
# Backend/.env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Frontend/.env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

The backend verifies the Google ID token, creates or links the user by verified email, and returns the application JWT. Google access tokens are not stored by Planova AI.

### 1. Backend Setup

First, navigate to the `Backend` directory and set up the server.

```bash
# Navigate to the backend folder
cd Backend

# Install dependencies
npm install
```

#### **API Keys and Environment Variables**

The backend requires several API keys to function. You need to create a `.env` file in the `Backend` directory and populate it with your keys.

```bash
# In the Backend/ directory
touch .env
```

Open the `.env` file and add the following variables:

```env
# MongoDB Connection String
# Get this from your MongoDB Atlas cluster by clicking "Connect" > "Shell"
MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/yourDatabaseName

# OpenRouter API Key
# 1. Go to https://openrouter.ai/
# 2. Create an account and generate an API key from the Keys page.
# 3. Claude Sonnet 4.5 is the default model below.
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5

# YouTube Data API Key
# 1. Go to the Google Cloud Console: https://console.cloud.google.com/
# 2. Create a new project.
# 3. Enable the "YouTube Data API v3".
# 4. Create credentials for an "API Key" and copy it here.
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY

# GetXAPI key for Twitter/X data
GETXAPI_KEY=YOUR_GETXAPI_KEY

# Google OAuth web client ID
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com

# JSON Web Token Secret
# This can be any long, random, and secret string.
JWT_SECRET=your_super_secret_random_string_for_jwt

# Server Port (Optional)
PORT=5000

# Redis connection URL (Optional; falls back to in-memory caching when absent)
# Redis Cloud commonly provides a rediss:// URL.
REDIS_URL=redis://localhost:6379
```

#### **Running the Backend**

Once the `.env` file is configured, you can start the server.

```bash
# Start the backend server
npm start
```

The server should now be running on `http://localhost:5000`.

Check backend readiness at `http://localhost:5000/health`. The response reports MongoDB status and whether Redis is connected or the local cache fallback is active.

### 2. Frontend Setup

In a new terminal window, navigate to the `Frontend` directory.

```bash
# Navigate to the frontend folder
cd Frontend

# Install dependencies
npm install
```

#### **Environment Variables**

The frontend only needs to know the URL of the backend API. Create a `.env` file in the `Frontend` directory.

```bash
# In the Frontend/ directory
touch .env
```

Open the file and add the following line:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

#### **Running the Frontend**

```bash
# Start the frontend development server
npm run dev
```

Your browser should automatically open to `http://localhost:5173`, and the application will be running.

The landing page explains the workflow with a creator example: enter an audience, topic, goal, and date range; collect signals from connected sources; and receive an editable content calendar with titles, formats, platforms, timing, status, and rationale.

## 📝 API Endpoints

All strategy, competitor, trend, and AI endpoints require a JWT bearer token.

*   **Health**: `GET /`, `GET /health`
*   **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`
*   **Strategies**: `GET /api/strategy`, `POST /api/strategy/generate`, `POST /api/strategy/generate-persona`, `GET /api/strategy/:id`, `DELETE /api/strategy/:id`
*   **Calendar**: `PUT /api/strategy/:strategyId/calendar/:day`
*   **Idea Bank**: `POST /api/strategy/generate-ideas`, `POST /api/strategy/expand-idea`
*   **Competitors**: `GET /api/competitors`, `POST /api/competitors`, `GET /api/competitors/:id/analyze-gaps`
*   **Trends**: `GET /api/trends?topic=<topic>`

### Generation Flow

```text
Creator input
	-> audience persona generation
	-> YouTube, GetXAPI, Reddit, and OpenRouter trend collection
	-> cached and normalized source data
	-> trend keywords passed to OpenRouter
	-> validated strategy and calendar saved to MongoDB
```

### Validation and Operations

Backend source validation:

```bash
cd Backend
npm run check
npm audit --omit=dev
```

Frontend validation and production build:

```bash
cd Frontend
npm run lint
npm run build
```

Redis is optional. If `REDIS_URL` is not configured or Redis is unavailable, the backend uses local memory caching and local rate-limit counters. For a multi-instance deployment, configure Redis so cache and rate limits are shared across instances.

### Production Environment

Set environment variables in the hosting provider rather than committing `.env` files. The backend needs `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `YOUTUBE_API_KEY`, `GETXAPI_KEY`, and `GOOGLE_CLIENT_ID`. `REDIS_URL` is optional, but recommended when running more than one backend instance. The frontend needs `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` at build time.

After deployment, verify the backend at:

```text
https://your-backend-domain.com/health
```

The health response should report `database: "connected"`. Redis may report either a connected Redis cache or the documented local fallback.
