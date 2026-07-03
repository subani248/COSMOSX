import axios from 'axios';

const BASE_URL = 'https://api.nasa.gov';

const nasaClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: process.env.NASA_API_KEY,
  },
});

export const getAPOD = async () => {
  const { data } = await nasaClient.get('/planetary/apod');
  return data;
};

export const getMarsPhotos = async ({ rover = 'curiosity', camera, page = 1, earth_date }) => {
  const params = { page };
  if (camera) params.camera = camera;
  if (earth_date) params.earth_date = earth_date;
  if (!earth_date) {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    params.earth_date = d.toISOString().split('T')[0];
  }
  try {
    const { data } = await axios.get(`https://rovers.nebulum.one/api/v1/rovers/${rover}/photos`, { params });
    return data.photos || [];
  } catch {
    return [];
  }
};

export const getAsteroids = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  const { data } = await nasaClient.get('/neo/rest/v1/feed', { params });
  return data;
};

export const getEarthImagery = async (lat, lon, date) => {
  const dim = 0.15;
  const xmin = parseFloat(lon) - dim / 2;
  const ymin = parseFloat(lat) - dim / 2;
  const xmax = parseFloat(lon) + dim / 2;
  const ymax = parseFloat(lat) + dim / 2;
  const selectedDate = date || new Date().toISOString().split('T')[0];

  const token = process.env.NASA_EDL_TOKEN;

  if (token && token.length > 20) {
    try {
      // Use NASA GIBS WMTS for date-specific satellite imagery
      const zoom = 8;
      const matrixWidth = 10 * Math.pow(2, Math.max(0, zoom - 3));
      const matrixHeight = matrixWidth / 2;
      const tileCol = Math.floor((parseFloat(lon) + 180) / 360 * matrixWidth);
      const tileRow = Math.floor((90 - parseFloat(lat)) / 180 * matrixHeight);
      const layer = 'MODIS_Terra_CorrectedReflectance_TrueColor';
      const url = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=${zoom}&TILEROW=${tileRow}&TILECOL=${tileCol}&FORMAT=image/jpeg&TIME=${selectedDate}`;
      return { url, date: selectedDate, service: 'NASA GIBS (MODIS Terra, date-specific)' };
    } catch {
      // fallback
    }
  }

  const fallbackUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${xmin},${ymin},${xmax},${ymax}&bboxSR=4326&size=800,600&format=png&f=image`;
  return { url: fallbackUrl, date: selectedDate, service: 'ESRI World Imagery' };
};

export const searchNasa = async (query, page = 1) => {
  const { data } = await axios.get('https://images-api.nasa.gov/search', {
    params: { q: query, page },
  });
  return data;
};

export default nasaClient;
