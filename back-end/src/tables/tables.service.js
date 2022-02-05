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

//PUT, updating a table, changes the status on a specific reservation and changes the reservation_id on a speicifc table
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

//GET, reads a table for a specific tableId
function read(tableId) {
  return knex("tables").where({ table_id: tableId }).first();
}

//GET, reads a speific reservation
function readReservation(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

//DELETE, changes the status of a reservation and the reservation_id on a table
//makes the reservation unavaliable, deletes it off the table
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
};
