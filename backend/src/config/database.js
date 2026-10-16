// Use embedded PostgreSQL locally so no separate database installation is needed.
// Set DATABASE_URL in backend/.env to use a regular PostgreSQL server instead.
const fs = require('node:fs');
const path = require('node:path');

const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
const usePostgres = Boolean(process.env.DATABASE_URL);
let database;
let initialization;

async function initializeDatabase() {
  if (usePostgres) {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (error) => {
      console.error('Unexpected PostgreSQL client error', error);
    });

    await pool.query(fs.readFileSync(schemaPath, 'utf8'));
    database = pool;
    return;
  }

  const { PGlite } = require('@electric-sql/pglite');
  const localDatabasePath = path.resolve(__dirname, '../../data/pglite');
  fs.mkdirSync(path.dirname(localDatabasePath), { recursive: true });

  const localDatabase = new PGlite(localDatabasePath);
  await localDatabase.waitReady;
  await localDatabase.exec(fs.readFileSync(schemaPath, 'utf8'));

  database = localDatabase;
  await require('../services/demoSeedService').seedDemoAccount();
  console.log(`Using local embedded database at ${localDatabasePath}`);
}

function readyDatabase() {
  if (!initialization) {
    initialization = initializeDatabase();
  }

  return initialization;
}

module.exports = {
  // Start the database before the API starts listening for requests.
  initialize: readyDatabase,
  // All models use this shared query helper for database access.
  query: async (text, params) => {
    if (!database) {
      await readyDatabase();
    }
    return database.query(text, params);
  },
  get pool() {
    return database;
  },
};
