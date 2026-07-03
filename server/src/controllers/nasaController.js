import {
  getAPOD,
  getMarsPhotos,
  getAsteroids,
  getEarthImagery,
  searchNasa,
} from '../config/nasa.js';

export const fetchAPOD = async (req, res) => {
  try {
    const data = await getAPOD();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch APOD' });
  }
};

export const fetchMarsPhotos = async (req, res) => {
  try {
    const { rover, sol, camera, page, earth_date } = req.query;
    const photos = await getMarsPhotos({ rover, sol, camera, page, earth_date });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Mars photos' });
  }
};

export const fetchAsteroids = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const start = req.query.startDate || sevenDaysAgo.toISOString().split('T')[0];
    const end = req.query.endDate || today.toISOString().split('T')[0];
    const data = await getAsteroids(start, end);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch asteroids' });
  }
};

export const fetchEarthImagery = async (req, res) => {
  try {
    const { lat, lon, date } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'Latitude and longitude required' });
    const data = await getEarthImagery(parseFloat(lat), parseFloat(lon), date);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Earth imagery' });
  }
};

export const fetchNasaSearch = async (req, res) => {
  try {
    const { q, page } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });
    const data = await searchNasa(q, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search NASA content' });
  }
};
