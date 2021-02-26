var express = require('express');
var router = express.Router();
const Details = require('../models/details');
const multer = require('multer');
const path = require('path');

var ctrlDetails = require('../controllers/details');

//retreving data from database
router.get('/all', ctrlDetails.getAll);
router.post('/add', ctrlDetails.addDetails);
router.delete('/delete/:id', ctrlDetails.deleteDetails);

module.exports = router;