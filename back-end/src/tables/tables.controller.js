/**
 * List handler for table resources
 */
 const service = require("./tables.service.js");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
 //---Middleware functions---//

 //checks to see if the user input anything into the fields (request body)
 function validForm(req, res, next) {
    const { data } = req.body;
  
    if (!data) {
      return next({
        status: 400,
        message: `You must include a table name and capacity.`,
      });
    }
    next();
  }
  
  //checks to see if the table includes the required fields to make a table 
  //table name and table capacity is required
  function hasRequiredFields(req, res, next) {
    const { data } = req.body;
    const requiredFields = [
      "table_name",
      "capacity",
    ];
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

    if ((data.table_name).length <= 1) {
      return next({
        status: 400,
        message: "table_name must be more than 1 character",
      });
    }
    next();
  }

  //---Router functions---//

  async function list(req, res) {
      const data = await service.list();
      res.json({ data });

  }


  async function create(req, res) {
    const createdTable = await service.create(req.body.data);
    res.status(201).json({ data: createdTable });
  }


  module.exports = {
    list: asyncErrorBoundary(list),
    create:[
        validForm,
        hasRequiredFields,
        isValidCapacity,
        isValidTableName,
        asyncErrorBoundary(create),
    ]
  }