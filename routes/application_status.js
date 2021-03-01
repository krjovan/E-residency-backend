var express = require('express');
var router = express.Router();
const Application_status = require('../models/application_status');

var ctrlApplication_status = require('../controllers/application_status');

router.get('/all', ctrlApplication_status.getAll);
router.post('/add', ctrlApplication_status.addApplicationStatus);
router.delete('/delete/:id', ctrlApplication_status.deleteApplicationStatus);

module.exports = router;