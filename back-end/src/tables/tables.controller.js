/**
 * List handler for table resources
 */
 const service = require("./tables.service.js");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
 //---Middleware functions---//

  //---Router functions---//

  async function list(req, res) {
      const data = await service.list();
      res.json({ data });

  }

  module.exports = {
    list: asyncErrorBoundary(list),
  }