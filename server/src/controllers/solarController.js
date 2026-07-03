import axios from 'axios';

const DONKI_BASE = 'https://api.nasa.gov/DONKI';
const API_KEY = process.env.NASA_API_KEY;

const CACHE = { flares: null, cmes: null, gsts: null, time: 0 };
const CACHE_TTL = 5 * 60 * 1000;

const api = axios.create({
  baseURL: DONKI_BASE,
  params: { api_key: API_KEY },
  timeout: 20000,
});

async function fetchWithRetry(url, params, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const { data } = await api.get(url, { params, timeout: 20000 });
      return data;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function getDateRange(daysBack) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
}

function serveFromCache(res, key, fallback = []) {
  if (CACHE[key] && Date.now() - CACHE.time < CACHE_TTL) {
    return res.json(CACHE[key]);
  }
  return res.json(fallback);
}

export const fetchSolarFlares = async (req, res) => {
  try {
    if (CACHE.flares && Date.now() - CACHE.time < CACHE_TTL) {
      return res.json(CACHE.flares);
    }
    const data = await fetchWithRetry('/FLR', getDateRange(30));
    const result = Array.isArray(data) ? data : [];
    CACHE.flares = result;
    CACHE.time = Date.now();
    res.json(result);
  } catch (err) {
    console.error('Solar flares error:', err.message);
    if (CACHE.flares) return res.json(CACHE.flares);
    res.json([]);
  }
};

export const fetchCMEs = async (req, res) => {
  try {
    if (CACHE.cmes && Date.now() - CACHE.time < CACHE_TTL) {
      return res.json(CACHE.cmes);
    }
    const data = await fetchWithRetry('/CME', getDateRange(30));
    const result = Array.isArray(data) ? data : [];
    CACHE.cmes = result;
    CACHE.time = Date.now();
    res.json(result);
  } catch (err) {
    console.error('CMEs error:', err.message);
    if (CACHE.cmes) return res.json(CACHE.cmes);
    res.json([]);
  }
};

export const fetchGSTs = async (req, res) => {
  try {
    if (CACHE.gsts && Date.now() - CACHE.time < CACHE_TTL) {
      return res.json(CACHE.gsts);
    }
    const data = await fetchWithRetry('/GST', getDateRange(60));
    const result = Array.isArray(data) ? data : [];
    CACHE.gsts = result;
    CACHE.time = Date.now();
    res.json(result);
  } catch (err) {
    console.error('GSTs error:', err.message);
    if (CACHE.gsts) return res.json(CACHE.gsts);
    res.json([]);
  }
};
