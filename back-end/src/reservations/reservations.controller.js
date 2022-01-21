/**
 * List handler for reservation resources
 */
const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//---Router functions---//

async function list(req, res) {
  let date = req.query.date;

  if (date) {
    const data = await service.listReservationsOnDate(date);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
