const AppError = require('../utils/appError');

const handleCastErrorDB = err =>
  new AppError(`Invalid ${err.path} : ${err.value}.`, 400);

// eslint-disable-next-line no-unused-vars
const handleDuplicateFiledsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value} Please use another value.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFiledsDB(err);
    // else if (err.name === 'ValidationError')
    //   error = handleValidationErrorDB(err);
    else error = { ...err };

    sendErrorProd(error, res);
  }
};
