const jwt = require('jsonwebtoken');

// In-memory storage for demo (replace with database later)
const users = new Map();
const tokens = new Set();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Check if token is in our active tokens set
    if (!tokens.has(token)) {
      return res.status(403).json({ message: 'Token has been revoked' });
    }
    
    req.user = user;
    next();
  });
};

// Middleware to check if user exists
const checkUserExists = (req, res, next) => {
  const userId = req.user.id;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  req.userData = user;
  next();
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper function to add token to active tokens
const addToken = (token) => {
  tokens.add(token);
};

// Helper function to remove token from active tokens
const removeToken = (token) => {
  tokens.delete(token);
};

// Helper function to get user by email
const getUserByEmail = (email) => {
  for (const [id, user] of users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// Helper function to create user
const createUser = (userData) => {
  const id = require('uuid').v4();
  const user = {
    id,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.set(id, user);
  return user;
};

// Helper function to update user
const updateUser = (userId, updateData) => {
  const user = users.get(userId);
  if (user) {
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    users.set(userId, updatedUser);
    return updatedUser;
  }
  return null;
};

// Helper function to delete user
const deleteUser = (userId) => {
  return users.delete(userId);
};

module.exports = {
  authenticateToken,
  checkUserExists,
  generateToken,
  addToken,
  removeToken,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  users,
  tokens
};
