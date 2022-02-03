const knex = require("../db/connection");

//POST, creating a new reservtion
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservations) => newReservations[0]);
}

//GET, read all reservations
function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

function listReservationsOnDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({status: "finished"})
    .orderBy("reservation_time");
}


//GET method to read a reservation for a specific reservationId
function read(reservationId) {
  return knex("reservations").where({ reservation_id: reservationId }).first();
}


//PUT method to update the status of a reservation
function update(reservationId, status){
  return knex("reservations")
  .where({ reservation_id: reservationId })
  .update({ status: status })
  .returning("*");

}


module.exports = {
  list,
  listReservationsOnDate,
  create,
  read,
  update,
};
