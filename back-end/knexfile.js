/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://yvbkdmwl:l1Za4P0JAY2iqAGwjfjdfTTlK1tuVpbK@castor.db.elephantsql.com/yvbkdmwl",
  DATABASE_URL_DEVELOPMENT = "postgres://yvbkdmwl:l1Za4P0JAY2iqAGwjfjdfTTlK1tuVpbK@castor.db.elephantsql.com/yvbkdmwl",
  DATABASE_URL_TEST = "postgres://yvbkdmwl:l1Za4P0JAY2iqAGwjfjdfTTlK1tuVpbK@castor.db.elephantsql.com/yvbkdmwl",
  DATABASE_URL_PREVIEW = "postgres://yvbkdmwl:l1Za4P0JAY2iqAGwjfjdfTTlK1tuVpbK@castor.db.elephantsql.com/yvbkdmwl",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
