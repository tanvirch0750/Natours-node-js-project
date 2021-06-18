const express = require('express');
const tourController = require('../controller/tourController');

// routes for tours
const router = express.Router();

// param midlleware
// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
