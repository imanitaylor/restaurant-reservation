const service = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//---MIDDLEWARE FUNCTIONS---//

//checks to see if the user input anything into the fields (request body)
function validForm(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: `You must include information in the form.`,
    });
  }
  next();
}

//checks to see if the table includes the required fields to make a table
//table name and table capacity is required
function hasRequiredFields(req, res, next) {
  const { data } = req.body;
  const requiredFields = ["table_name", "capacity"];
  for (const field of requiredFields) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Table must include a ${field}`,
      });
    }
  }
  next();
}

//checks to make sure that the capacity is a number and not 0
function isValidCapacity(req, res, next) {
  const { data } = req.body;
  if (!Number.isInteger(data.capacity) || data.capacity === 0) {
    return next({
      status: 400,
      message: "capacity must be a number and higher than 0.",
    });
  }
  next();
}

//checks to make sure the table name has more than 1 character
function isValidTableName(req, res, next) {
  const { data } = req.body;

  if (data.table_name.length <= 1) {
    return next({
      status: 400,
      message: "table_name must be more than 1 character",
    });
  }
  next();
}

//to make sure that the table parameter has a matching id to a table in the database
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await service.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  return next({ status: 404, message: `${tableId} cannot be found.` });
}

//to make sure that the reservation parameter has a matching id to a reservation in the database
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "please include a reservation_id",
    });
  }

  const reservation = await service.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `${reservation_id} cannot be found.`,
    });
  }
}

//makes sure that the table has enough capacity for the reservations required amount of seats
function sufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;

  if (capacity < people) {
    return next({
      status: 400,
      message:
        "The party size is greater than the table capacity. Please select another table",
    });
  }
  next();
}

//checks to see if table is occupied, the reservation_id has a reservation_id
function isOccupied(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is occupied.`,
    });
  }
  next();
}

//checks to see if table is not occupied (there is no reservationId, its null)
function isNotOccupied(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (!occupied) {
    return next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is not occupied.`,
    });
  }
  next();
}

//checks if a reservations status is already seated
function reservationAlreadySeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: `This reservations is already seated.`,
    });
  }
  next();
}

//---ROUTER FUNCTIONS---//

//GET, list all tables
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

//POST, creates a new table
async function create(req, res) {
  const createdTable = await service.create(req.body.data);
  res.status(201).json({ data: createdTable });
}

//PUT, updating an existing table
//changes the reservation to be seated, assigns an id to the tables reservation_id
async function update(req, res) {
  const { reservation_id } = req.body.data;
  const table_id = res.locals.table.table_id;
  const data = await service.update(reservation_id, table_id);
  res.status(200).json({ data });
}

//GET, reads a table based on table_id
async function read(req, res, next) {
  const { table } = res.locals;
  const data = await service.read(table.table_id);
  res.status(200).json({ data });
}

//DELETE, makes table avaliable (reservation_id = null) and status of reservation = finished
//doesn't completely delete reservation from database
async function deleteTableReservation(req, res) {
  const { tableId } = req.params;
  const reservationId = res.locals.table.reservation_id;
  const data = await service.delete(reservationId, tableId);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validForm,
    hasRequiredFields,
    isValidCapacity,
    isValidTableName,
    asyncErrorBoundary(create),
  ],
  update: [
    validForm,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    sufficientCapacity,
    isOccupied,
    reservationAlreadySeated,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    isNotOccupied,
    asyncErrorBoundary(deleteTableReservation),
  ],
};
