// This service holds the business logic for registration and login.
// It validates data, hashes passwords, and creates JWT tokens for the frontend.
const bcrypt = require('bcryptjs');
const { createUser, findByEmail } = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const { validateRegistrationInput, validateLoginInput } = require('../utils/validation');

async function registerUser({ name, email, password }) {
  validateRegistrationInput({ name, email, password });

  const existingUser = await findByEmail(email.trim().toLowerCase());
  if (existingUser) {
    throw Object.assign(
      new Error('This email is already registered. Please sign in instead.'),
      { statusCode: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
  });

  const token = signToken({ id: createdUser.id, email: createdUser.email });

  return {
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  validateLoginInput({ email, password });

  const user = await findByEmail(email.trim().toLowerCase());
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const token = signToken({ id: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
