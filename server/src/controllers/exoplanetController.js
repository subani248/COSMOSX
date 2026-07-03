import axios from 'axios';

const TAP_BASE = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

const COLUMNS = [
  'pl_name', 'hostname', 'pl_orbper', 'pl_rade', 'pl_bmasse',
  'pl_dens', 'pl_eqt', 'sy_dist', 'discoverymethod', 'disc_year',
  'disc_facility', 'pl_orbsmax', 'pl_insol', 'pl_ratror', 'st_spectype',
];

const FETCH_LIMIT = 1000;

export const fetchExoplanets = async (req, res) => {
  try {
    const { page = 1, perPage = 30, search = '' } = req.query;
    const cols = COLUMNS.join(',');

    let condition = 'pl_name is not null';
    if (search) {
      const s = search.replace(/'/g, "''");
      condition += ` and (pl_name like '%${s}%' or hostname like '%${s}%')`;
    }

    const limit = Math.min(parseInt(perPage), 50);
    const offset = (parseInt(page) - 1) * limit;

    const query = `select top ${FETCH_LIMIT} ${cols} from ps where ${condition} order by disc_year desc, pl_name`;

    const { data } = await axios.get(`${TAP_BASE}?query=${encodeURIComponent(query)}&format=json`, { timeout: 15000 });

    const allRows = Array.isArray(data) ? data : [];
    const planets = allRows.slice(offset, offset + limit);

    const total = allRows.length;

    res.json({ planets, total, page: parseInt(page), perPage: limit });
  } catch (err) {
    console.error('Exoplanet fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch exoplanets', error: err.message });
  }
};
