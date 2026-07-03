import Journal from '../models/Journal.js';

export const getEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
};

export const createEntry = async (req, res) => {
  try {
    const { title, content, tags, nasaImageUrl, nasaImageTitle, isPublic } = req.body;
    const entry = await Journal.create({
      user: req.user._id,
      title,
      content,
      tags,
      nasaImageUrl,
      nasaImageTitle,
      isPublic,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update entry' });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
};

export const searchEntries = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });
    const entries = await Journal.find({
      user: req.user._id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search entries' });
  }
};
