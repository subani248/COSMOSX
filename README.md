# 🚀 CosmosX – AI Secure Space Explorer

A full-stack MERN application with a futuristic NASA-inspired design, featuring glassmorphism UI, AI-powered space exploration, and enterprise-grade security.

## ✨ Features

### 🛸 Authentication & Security
- Email/Password registration & login (bcrypt + JWT)
- Google OAuth 2.0 integration
- Express Rate Limiting (brute-force protection)
- Helmet HTTP security headers
- CORS configuration
- Input validation
- Automatic logout after 30min inactivity

### 🌌 NASA API Integration
- **Astronomy Picture of the Day** – HD images with AI explanations
- **Mars Rover Explorer** – Browse Curiosity, Opportunity, Spirit photos
- **Near-Earth Asteroid Tracker** – Real-time speed, size, distance, hazard
- **Earth Imagery** – Satellite photos by coordinates
- **NASA Content Search** – Explore planets, galaxies, nebulae, missions

### 🤖 AI Features (Gemini Integration)
- Explain NASA images in simple terms
- Ask astronomy questions
- Learn about planets, stars, galaxies, black holes
- Chat history storage

### 👤 User Features
- Save favorite NASA images
- Personal Space Journal with NASA image attachments
- Search saved content
- Profile management

## 🛠 Tech Stack

**Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion + Lucide Icons  
**Backend**: Node.js + Express.js + MongoDB + Mongoose  
**Auth**: JWT + bcrypt + Google OAuth 2.0  
**APIs**: NASA Open APIs + Google Gemini AI  
**Security**: Helmet + CORS + Rate Limiting  

## 📁 Folder Structure

```
CosmosX/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── landing/       # Landing page sections
│   │   │   ├── layout/        # Navbar, Sidebar, DashboardLayout
│   │   │   ├── auth/          # Auth components
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── nasa/          # NASA-specific components
│   │   │   ├── ai/            # AI chat components
│   │   │   ├── journal/       # Journal components
│   │   │   ├── favorites/     # Favorites components
│   │   │   └── profile/       # Profile components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React contexts
│   │   ├── services/          # API service layer
│   │   └── styles/            # Global styles
│   └── public/
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/            # DB, NASA, Gemini config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, rate limit, validation
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers
│   │   └── validators/        # Input validation
│   └── .env
├── vercel.json
├── render.yaml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- NASA API key (free: https://api.nasa.gov)
- Google OAuth 2.0 credentials
- Gemini API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd CosmosX

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/cosmosx
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
NASA_API_KEY=your_nasa_api_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000/api
```

### Run Locally

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Open http://localhost:5173

## 🌍 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Render)
1. Connect GitHub repository
2. Use `render.yaml` or manual config:
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`

### Database (MongoDB Atlas)
Create a free cluster and add connection string to `MONGODB_URI`

## 🔒 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/google` | POST | Google OAuth |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/profile` | PUT | Update profile |
| `/api/nasa/apod` | GET | Astronomy Picture of the Day |
| `/api/nasa/mars-photos` | GET | Mars rover photos |
| `/api/nasa/asteroids` | GET | NEO asteroid data |
| `/api/nasa/earth-imagery` | GET | Earth satellite imagery |
| `/api/nasa/search` | GET | NASA content search |
| `/api/favorites` | GET/POST | User favorites |
| `/api/favorites/:id` | DELETE | Remove favorite |
| `/api/favorites/check/:nasaId` | GET | Check if favorited |
| `/api/journal` | GET/POST | Journal entries |
| `/api/journal/:id` | PUT/DELETE | Update/delete entry |
| `/api/journal/search` | GET | Search entries |
| `/api/chat/message` | POST | AI chat message |
| `/api/chat/explain` | POST | Explain NASA image |
| `/api/chat/sessions` | GET | Chat sessions |
| `/api/chat/history/:sessionId` | GET | Chat history |

## 📝 License

MIT
