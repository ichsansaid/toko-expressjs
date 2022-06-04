const Exception = require("../exceptions/exception.error");

const errorHandler = (err, req, res, next) => {
  if(err instanceof Exception){
    res.status(500).json({
      message: err.getMessage(),
      data: err.getData()
    })
  } else {
    res.status(500).json({
      message: err.message
    })
  }
};

module.exports = errorHandler;