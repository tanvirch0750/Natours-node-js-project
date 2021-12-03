const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// require app error class & handler
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

// require routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// global middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, // this number is according to your api request traffic
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour!',
});
app.use('/api', limiter);

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
