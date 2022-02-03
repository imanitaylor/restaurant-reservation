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

//PUT method route, updating a table
function update(reservationId, tableId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "seated" })
    .then(() => {
      return knex("tables")
        .where({ table_id: tableId })
        .update({ reservation_id: reservationId })
        .returning("*");
    });
}

//GET method to read a table for a specific tableId
function read(tableId) {
  return knex("tables").where({ table_id: tableId }).first();
}


function readReservation(reservationId) {
  return knex("reservations")
      .select("*")
      .where({ reservation_id: reservationId })
      .first();
}

function deleteTableReservation(reservationId, tableId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: "finished" })
    .then(() => {
      return knex("tables")
        .where({ table_id: tableId })
        .update({ reservation_id: null })
        .returning("*");
    });
}


module.exports = {
list, 
create,
update,
read,
readReservation,
delete: deleteTableReservation,
}