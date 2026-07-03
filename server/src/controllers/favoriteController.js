import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { nasaId, title, url, hdurl, mediaType, explanation, date, source, metadata } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, nasaId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });
    const favorite = await Favorite.create({
      user: req.user._id,
      nasaId,
      title,
      url,
      hdurl,
      mediaType,
      explanation,
      date,
      source,
      metadata,
    });
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      nasaId: req.params.nasaId,
    });
    res.json({ isFavorite: !!favorite, favorite });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check favorite' });
  }
};
