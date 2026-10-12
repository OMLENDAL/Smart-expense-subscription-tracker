// This model contains all database operations for the users table.
// It keeps the SQL logic separate from the controller and service layers.
const db = require('../config/database');

async function createUser({ name, email, password }) {
  const result = await db.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, password],
  );

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1`,
    [id],
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
