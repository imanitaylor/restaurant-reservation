const knex = require("../db/connection");

//POST, creating a new reservtion
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservations) => newReservations[0]);
}

//GET, lists all reservations
function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

//GET, lists reservations that are not finished or cancelled on a specific date
function listReservationsOnDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

//GET, lists all reservations that match a searched number
function listReservationsWithMobile(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D+/g, "")}%`
    )
    .orderBy("reservation_time");
}

//GET, reads a reservation for a specific reservationId
function read(reservationId) {
  return knex("reservations").where({ reservation_id: reservationId }).first();
}

//PUT, updates just the status of a reservation
function updateStatus(reservationId, status) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: status })
    .returning("*");
}

//PUT, updates whatever field the user would like to change
function update(updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((res) => res[0]);
}

module.exports = {
  list,
  listReservationsOnDate,
  listReservationsWithMobile,
  create,
  read,
  updateStatus,
  update,
};
