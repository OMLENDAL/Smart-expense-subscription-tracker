// This file starts the backend server.
require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const port = process.env.PORT || 5000;

// Initialize the database first so setup errors are reported before serving requests.
db.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start the backend because the database could not be initialized.', error);
    process.exitCode = 1;
  });
