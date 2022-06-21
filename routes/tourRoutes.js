

const express = require('express');

const router = express.Router();

const tourController = require('./../controllers/tourControllers');

//const {getAllTours, getTour..} = require('./../controllers/tourControllers');

// router.param('id', tourController.checkID);
//Create a checkBody middleware
//Check if body contains the name and price propriety
//if not sed back 400(bad request )
// ad it to the pst handler stack

router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;