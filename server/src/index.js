import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import nasaRoutes from './routes/nasa.js';
import favoriteRoutes from './routes/favorites.js';
import journalRoutes from './routes/journal.js';
import uploadRoutes from './routes/upload.js';
import chatRoutes from './routes/chat.js';
import moonRoutes from './routes/moon.js';
import issRoutes from './routes/iss.js';
import exoplanetRoutes from './routes/exoplanet.js';
import solarRoutes from './routes/solar.js';
import newsRoutes from './routes/news.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiLimiter);

app.get('/api', (req, res) => res.json({ name: 'CosmosX API', version: '1.0.0', status: 'running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/nasa', nasaRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/chat', chatRoutes);
app.use('/api/moon', moonRoutes);
app.use('/api/iss', issRoutes);
app.use('/api/exoplanets', exoplanetRoutes);
app.use('/api/solar', solarRoutes);
app.use('/api/news', newsRoutes);

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`CosmosX server running on port ${PORT}`));
};

start();
