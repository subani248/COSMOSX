import ChatHistory from '../models/ChatHistory.js';
import { askGemini, explainAstronomy } from '../config/gemini.js';
import { v4 as uuidv4 } from 'uuid';

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const sid = sessionId || uuidv4();

    const pastMessages = await ChatHistory.find({
      user: req.user._id,
      sessionId: sid,
    }).sort({ createdAt: 1 });

    const history = pastMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await ChatHistory.create({
      user: req.user._id,
      role: 'user',
      content: message,
      sessionId: sid,
    });

    const response = await askGemini(message, history);

    await ChatHistory.create({
      user: req.user._id,
      role: 'model',
      content: response,
      sessionId: sid,
    });

    res.json({ response, sessionId: sid });
  } catch (err) {
    console.error('AI chat error:', err.message, err.stack?.substring(0, 500));
    res.status(500).json({ message: 'Failed to get AI response', error: err.message });
  }
};

export const explainImage = async (req, res) => {
  try {
    const { imageTitle, explanation } = req.body;
    if (!imageTitle) return res.status(400).json({ message: 'Image title is required' });

    const response = await explainAstronomy(`Title: ${imageTitle}. Description: ${explanation || 'N/A'}`);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: 'Failed to explain image' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatHistory.find({
      user: req.user._id,
      sessionId,
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get chat history' });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await ChatHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$sessionId', createdAt: { $min: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get sessions' });
  }
};
