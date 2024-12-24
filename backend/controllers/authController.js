const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const register = async (req, res) => {
    const { name, dob, email, password, username } = req.body;
  
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
  
    try {
      // Check if email or username is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
  
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        name,
        username, // Add the username field here
        dob,
        email,
        password: hashedPassword,
      });
  
      // Save user to the database
      await newUser.save();
  
      // Generate JWT Token
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
  
      // Send response with token
      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error during registration' });
      console.error(err);
    }
  };
  
// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT Token with additional user details
      const token = jwt.sign(
        {
          userId: user._id, 
          name: user.name, 
          dob: user.dob, // Assuming 'dob' is part of your User schema
          email: user.email
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ 
        message: 'Login successful', 
        token 
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error during login' });
    }
  };
  
module.exports = { register, login };
