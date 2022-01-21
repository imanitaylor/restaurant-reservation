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
    .orderBy("reservation_time");
}

module.exports = {
  list,
  listReservationsOnDate,
  create,
};