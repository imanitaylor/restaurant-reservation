const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//---MIDDLEWARE FUNCTIONS---//

//checks to make sure that the form has input data at all
function validForm(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: `You must submit a first name, last name, mobile number, reservation time and reservation date.`,
    });
  }
  next();
}

//checks to see if the reservation includes the required fields to make or edit a reservation
function hasRequiredFields(req, res, next) {
  const { data } = req.body;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
    }
  }
  next();
}

//checks to make sure the date the user entered matches our database's format
function isValidDate(req, res, next) {
  const { data } = req.body;
  const validDate = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  if (!validDate.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date must be a valid date.",
    });
  }
  next();
}

//checks to see if the selected date is a tuesday, sends error if a tuesday
function isNotTuesday(req, res, next) {
  const { data } = req.body;
  const date = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays. Please pick another day.",
    });
  }
  next();
}

//checks to see if the selected date and time is in the future
function isNotInPast(req, res, next) {
  const { data } = req.body;
  const date = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const today = new Date();
  if (date < today) {
    return next({
      status: 400,
      message: "Please only pick a reservation day and time in the future.",
    });
  }
  next();
}

//checks to make sure the time the user entered is a time that matches our database's format
function isValidTime(req, res, next) {
  const { data } = req.body;
  const validTime = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!validTime.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time must be a valid time.",
    });
  }
  next();
}

//checks is reservations is after 10:30 AM but before 9:30 PM
function isRestaurantOpen(req, res, next) {
  const { data } = req.body;
  const reservationTime = parseInt(
    data.reservation_time.slice(0, 2) + data.reservation_time.slice(3)
  );

  if (reservationTime < 1030 || reservationTime > 2130) {
    return next({
      status: 400,
      message:
        "Reservation time must be when the restaurant is open. Please select a time after 10:30 AM and before 9:30 PM (an hour before we close).",
    });
  }
  next();
}

//checks to make sure that party size (amount of people for reservation) is a number
function isValidPartySize(req, res, next) {
  const { data } = req.body;
  if (!Number.isInteger(data.people)) {
    return next({
      status: 400,
      message: "people must be a number",
    });
  }
  next();
}

//checks if this reservation exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  return next({
    status: 404,
    message: `${reservationId} cannot be found`,
  });
}

//when updating the status of a reservation, checks is there is a status and if it is not booked
function validStatus(req, res, next) {
  const status = req.body.data.status;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Reservation is already ${status}`,
    });
  }
  next();
}

//checks if the status is unknown
function unknownStatus(req, res, next) {
  const status = req.body.data.status;

  if (status === "unknown") {
    return next({
      status: 400,
      message: `Reservation status is unknown`,
    });
  }
  next();
}

//checks to see if status is finished
function statusFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: `${status} reservation cannot be updated`,
    });
  }
  next();
}

//---ROUTE FUNCTIONS---//

//GET, reads reservations
async function list(req, res) {
  let date = req.query.date;
  let mobile_number = req.query.mobile_number;

  //if there is a data query then use the listReservationsOnDate service
  if (date) {
    const data = await service.listReservationsOnDate(date);
    res.json({ data });
  }

  //if there is a mobile_number query, then use the listReservationsWithMobile service
  else if (mobile_number) {
    const data = await service.listReservationsWithMobile(mobile_number);
    res.json({ data });
  }

  //a fall back case of a normal list service used
  else {
    const data = await service.list();
    res.json({ data });
  }
}

//POST, creates a new reservation
async function create(req, res) {
  const createdReservation = await service.create(req.body.data);
  res.status(201).json({ data: createdReservation });
}

//GET, reads one specific reservation based on reservation_id
async function read(req, res, next) {
  const { reservation } = res.locals;
  const data = await service.read(reservation.reservation_id);
  res.status(200).json({ data });
}

//PUT, updates only the status of a reservation (seated, finished, cancelled)
async function updateStatus(req, res) {
  const reservation_id = res.locals.reservation.reservation_id;
  let { status } = req.body.data;
  if (!status) {
    status = "cancelled";
  }
  const data = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: { status } });
}

//PUT, updates whatever fields the user would like to update
async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const newData = await service.update(updatedReservation);
  res.json({ data: newData });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validForm,
    hasRequiredFields,
    isValidPartySize,
    isValidDate,
    isNotTuesday,
    isNotInPast,
    isValidTime,
    isRestaurantOpen,
    validStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    unknownStatus,
    statusFinished,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    validForm,
    hasRequiredFields,
    isValidPartySize,
    isValidDate,
    isNotTuesday,
    isNotInPast,
    isValidTime,
    isRestaurantOpen,
    validStatus,
    asyncErrorBoundary(update),
  ],
};
