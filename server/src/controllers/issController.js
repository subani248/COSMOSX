import https from 'https';

const ISS_SATELLITE_ID = 25544;
const CACHE = { data: null, time: 0 };
const CACHE_TTL = 3000;

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CosmosX/1.0' }, timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON')); }
      });
    }).on('error', reject).on('timeout', function () { this.destroy(); reject(new Error('timeout')); });
  });
}

export const fetchISSPosition = async (req, res) => {
  try {
    if (Date.now() - CACHE.time < CACHE_TTL) {
      return res.json(CACHE.data);
    }
    const data = await httpsGet(`https://api.wheretheiss.at/v1/satellites/${ISS_SATELLITE_ID}`);
    CACHE.data = data;
    CACHE.time = Date.now();
    res.json(data);
  } catch (err) {
    console.error(`ISS error: ${err.message}`);
    if (CACHE.data) return res.json(CACHE.data);
    res.status(502).json({ message: 'Failed to fetch ISS data' });
  }
};

export const fetchISSPositions = async (req, res) => {
  try {
    const { timestamps } = req.query;
    if (!timestamps) return res.status(400).json({ message: 'timestamps required' });
    const ts = timestamps.split(',').map(Number).filter((t) => !isNaN(t)).slice(0, 60);
    if (ts.length === 0) return res.status(400).json({ message: 'Invalid timestamps' });
    const results = await Promise.allSettled(
      ts.map((t) => httpsGet(`https://api.wheretheiss.at/v1/satellites/${ISS_SATELLITE_ID}/positions?timestamp=${t}&units=kilometers`))
    );
    const positions = results.filter((r) => r.status === 'fulfilled').flatMap((r) => r.value);
    res.json(positions);
  } catch (err) {
    console.error(`ISS positions error: ${err.message}`);
    res.status(502).json({ message: 'Failed to fetch orbital positions' });
  }
};
