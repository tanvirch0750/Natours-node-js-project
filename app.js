const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());

// our own middleware
app.use((req, res, next) => {
  console.log(`Hello from the middleware`);
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// read file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS FOR TOURS
// get
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

// get (single tour)
const getSingleTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(el => +el.id === id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// post
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// patch
const updateTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

// delete
const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ROUTE HANDLERS FOR USERS
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

// routes for tours
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

// routes for users
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
