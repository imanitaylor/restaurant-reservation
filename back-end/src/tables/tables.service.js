const knex = require("../db/connection");

//GET, read all tables, in order by table name
function list() {
    return knex("tables").select("*").orderBy("table_name");
  }


//POST, creating a new table
function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((newTable) => newTable[0]);
  }





module.exports = {
list,
create,
}