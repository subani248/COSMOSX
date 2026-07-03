import crypto from 'crypto';
import axios from 'axios';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import generateToken from '../utils/generateToken.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` },
    });
    const { name, email, picture, sub } = data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, avatar: picture });
    } else if (!user.googleId) {
      user.googleId = sub;
      user.avatar = user.avatar || picture;
      await user.save();
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, bio, location, website, github, twitter, linkedin, instagram, preferences } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (github !== undefined) user.github = github;
    if (twitter !== undefined) user.twitter = twitter;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (instagram !== undefined) user.instagram = instagram;
    if (preferences !== undefined) user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const token = crypto.randomBytes(32).toString('hex');
    await PasswordReset.create({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + 3600000),
    });

    res.json({ message: 'Reset link sent', resetToken: token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const reset = await PasswordReset.findOne({ token, used: false, expiresAt: { $gt: new Date() } });
    if (!reset) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = await User.findById(reset.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();
    reset.used = true;
    await reset.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
