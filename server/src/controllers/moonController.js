import axios from 'axios';

const CACHE = { data: null, date: '', time: 0 };
const CACHE_TTL = 60 * 60 * 1000;

export const fetchMoonPhase = async (req, res) => {
  try {
    const { date } = req.query;
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = date || today;

    if (CACHE.data && CACHE.date === cacheKey && Date.now() - CACHE.time < CACHE_TTL) {
      return res.json(CACHE.data);
    }

    const params = { include_visuals: true, include_zodiac: true };
    if (date) params.date = date;

    const { data } = await axios.get('https://api.freeastroapi.com/api/v1/moon/phase', {
      headers: { 'x-api-key': process.env.FREE_ASTRO_API_KEY },
      params,
      timeout: 10000,
    });

    CACHE.data = data;
    CACHE.date = cacheKey;
    CACHE.time = Date.now();

    res.json(data);
  } catch (err) {
    console.error('Moon API error:', err.message);
    if (CACHE.data && CACHE.date === (req.query.date || new Date().toISOString().split('T')[0])) {
      return res.json(CACHE.data);
    }
    res.status(500).json({ message: 'Failed to fetch moon data', error: err.message });
  }
};
