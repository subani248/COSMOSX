import axios from 'axios';

const NEWS_BASE = 'https://api.spaceflightnewsapi.net/v4';

export const fetchNews = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '' } = req.query;
    const params = { limit: Math.min(parseInt(limit), 50), offset: (parseInt(page) - 1) * parseInt(limit) };
    if (search) params.search = search;

    const { data } = await axios.get(`${NEWS_BASE}/articles`, { params, timeout: 10000 });
    res.json({ articles: data.results || [], total: data.count || 0, page: parseInt(page) });
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch space news', error: err.message });
  }
};

export const fetchNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${NEWS_BASE}/articles/${id}`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: 'Article not found' });
  }
};
