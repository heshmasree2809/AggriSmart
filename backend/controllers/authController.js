const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.signup = async (req, res) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in .env file');
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB is not connected');
      return res.status(503).json({ success: false, message: 'Database connection unavailable. Please try again later.' });
    }

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    // Generate token for auto-login after signup
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const userObj = user.toObject();
    delete userObj.password;
    
    console.log(`✅ New user signed up: ${email}`);
    res.status(201).json({ success: true, message: 'Signup successful', token, user: userObj });
  } catch (err) {
    console.error('❌ Signup error:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', error: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    if (err.name === 'MongoServerError' || err.message?.includes('Mongo')) {
      return res.status(503).json({ success: false, message: 'Database error. Please try again later.', error: 'Database connection issue' });
    }
    
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in .env file');
      return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET missing' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB is not connected');
      return res.status(503).json({ success: false, message: 'Database connection unavailable. Please try again later.' });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const userObj = user.toObject();
    delete userObj.password;
    
    console.log(`✅ User logged in: ${email}`);
    res.json({ success: true, message: 'Login successful', token, user: userObj });
  } catch (err) {
    console.error('❌ Login error:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'MongoServerError' || err.message?.includes('Mongo')) {
      return res.status(503).json({ success: false, message: 'Database error. Please try again later.', error: 'Database connection issue' });
    }
    
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

