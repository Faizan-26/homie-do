import User from '../models/userModel.js';

// Create a new user
export async function createUser(userData) {
  const user = new User(userData);
  return await user.save();
}

// Find user by email
export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

// Find user by ID
export async function findUserById(id) {
  return await User.findById(id);
}

// Find user by Google ID
export async function findUserByGoogleId(googleId) {
  return await User.findOne({ googleId });
}

// Update user
export async function updateUser(id, updateData) {
  return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}


