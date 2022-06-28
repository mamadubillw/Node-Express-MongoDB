const express = require('express');

const tourController = require('./../controllers/tourControllers');
const router = express.Router();
//const {getAllTours, getTour..} = require('./../controllers/tourControllers');

// router.param('id', tourController.checkID);
//Create a checkBody middleware
//Check if body contains the name and price propriety
//if not sed back 400(bad request )
// ad it to the pst handler stack

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/tour-stats').get(tourController.getTourStats, tourController.getAllTours);
router.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour) 
.delete(tourController.deleteTour);

module.exports = router;