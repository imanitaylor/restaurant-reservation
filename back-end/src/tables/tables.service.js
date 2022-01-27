const knex = require("../db/connection");

//GET, read all tables
function list() {
    return knex("tables").select("*").orderBy("table_name");
  }

module.exports = {
list,
}