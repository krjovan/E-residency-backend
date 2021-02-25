var express = require('express');
var router = express.Router();
const Location = require('../models/location');
const multer = require('multer');
const path = require('path');

var ctrlLocation = require('../controllers/location');

//retreving data from database
router.get('/all', ctrlLocation.getAll);
router.get('/withPagination', ctrlLocation.getLocationsByPagination);
router.get('/numberOfLocations', ctrlLocation.numberOfLocations);
router.post('/add', ctrlLocation.addLocation);
router.put('/update/:id', ctrlLocation.updateLocation);
router.delete('/delete/:id', ctrlLocation.deleteLocation);

module.exports = router;