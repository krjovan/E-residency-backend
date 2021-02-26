var express = require('express');
var router = express.Router();
const Application = require('../models/application');
const multer = require('multer');
const path = require('path');

var ctrlApplication = require('../controllers/application');

//retreving data from database
router.get('/all', ctrlApplication.getAll);
//router.get('/withPagination', ctrlApplication.getLocationsByPagination);
//router.get('/numberOfLocations', ctrlApplication.numberOfLocations);
router.post('/add', ctrlApplication.addApplication);
//router.put('/update/:id', ctrlApplication.updateLocation);
router.delete('/delete/:id', ctrlApplication.deleteApplication);

module.exports = router;