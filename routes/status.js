var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
const Status = require('../models/status');
const multer = require('multer');
const path=require('path');

var ctrlStatus = require('../controllers/status');

router.get('/all', ctrlStatus.getAll);
router.post('/add', ctrlStatus.addStatus);
router.delete('/delete/:id', ctrlStatus.deleteStatus);


module.exports = router;