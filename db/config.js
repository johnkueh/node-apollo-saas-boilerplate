require('dotenv').config();

const {
  DATABASE_USER: username,
  DATABASE_PASSWORD: password,
  DATABASE: database,
  DATABASE_HOST: host,
  DATABASE_DIALECT: dialect
} = process.env;

module.exports = {
  username,
  password,
  database,
  host,
  dialect,
  operatorsAliases: false
};
