// require('dotenv').config();

// module.exports = {
//   DB_HOST: process.env.DB_HOST,
//   DB_USER: process.env.DB_USER,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_NAME: process.env.DB_NAME
// };

require('dotenv').config();

module.exports = {
  DB_HOST: process.env.DB_HOST || process.env.AIVEN_DB_HOST,
  DB_USER: process.env.DB_USER || process.env.AIVEN_DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.AIVEN_DB_PASSWORD,
  DB_NAME: process.env.DB_NAME || process.env.AIVEN_DB_NAME
};
