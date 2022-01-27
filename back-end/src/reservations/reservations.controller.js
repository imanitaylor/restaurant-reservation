/**
 * List handler for reservation resources
 */
const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//---Middleware functions---//

//checks to see reservation form has input data at all
function validForm(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: `You must submit your first name, last name, mobile number, reservation time and reservation date.`,
    });
  }
  next();
}

//checks to see if the reservation includes the required fields to make a reservation 
//First and Last name, mobile number, reservation time, reservtion date and a party size (people)
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

//checks to make sure the date the user entered is an actual date
//and that matches our database's format
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
function isNotTuesday(req, res, next){
  const { data } = req.body;
  const date = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 2){
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays. Please pick another day.",
  })
}
next();
}

//checks to see if the selected date is in the future
function isNotInPast(req, res, next){
  const { data } = req.body;
  const date = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const today = new Date();
  if (date < today){
    return next({
      status: 400,
      message: "Please only pick a reservation day and time in the future.",
  })
}
next();
}

//checks to make sure the time the user entered is an actual time
//And that matches our database's format
function isValidTime(req, res, next) {
  const { data } = req.body;
  const validTime =/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!validTime.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time must be a valid time.",
    });
  }
  next();
}

//checks is reservations is after 10:30 AM but before 9:30 PM, if so then send error message
function isRestaurantOpen(req, res, next){
  const { data } = req.body;
  const reservationTime = parseInt(((data.reservation_time).slice(0,2)) + ((data.reservation_time).slice(3)));

  if (reservationTime < 1030 || reservationTime > 2130){
    return next({
      status: 400,
      message: "Reservation time must be when the restaurant is open. Please select a time after 10:30 AM and before 9:30 PM (an hour before we close).",
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

  //if reservation exist then stores that reservation in local variable and pass it to the next function
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  //if not then pass an error to the user
  return next({
    status: 404,
    message: "reservation cannot be found.",
  });
}


//---Router functions---//

async function list(req, res) {
  let date = req.query.date;

  if (date){
    const data = await service.listReservationsOnDate(date);
    res.json({ data });
  }
  else {
    const data = await service.list();
    res.json({ data });
  }



}

async function create(req, res) {
  const createdReservation = await service.create(req.body.data);
  res.status(201).json({ data: createdReservation });
}



//passes a local variable to read a reservation
async function read(req, res, next) {
  const { reservation } = res.locals;
  const data = await service.read(reservation.reservation_id);
  res.status(200).json({ data });
  
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
    asyncErrorBoundary(create),
  ],
  read:[
    reservationExists,
    asyncErrorBoundary(read),
  ]
};
