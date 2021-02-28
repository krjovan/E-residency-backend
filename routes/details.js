var express = require('express');
var router = express.Router();
const Details = require('../models/details');

const multer = require('multer');
var fileExtension = require('file-extension');
const path = require('path');

var storage = multer.diskStorage({

		// Setting directory on disk to save uploaded files
		destination: function (req, file, cb) {
			cb(null, 'images')
		},

		// Setting name of file saved
		filename: function (req, file, cb) {
			cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
		}
	});

var upload = multer({
	storage: storage,
	limits: {
		// Setting Image Size Limit to 2MBs
		fileSize: 2000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			//Error 
			cb(new Error('Please upload JPG and PNG images only!'))
		}
		//Success 
		cb(undefined, true)
	}
});

var ctrlDetails = require('../controllers/details');

//retreving data from database
router.get('/all', ctrlDetails.getAll);
router.post('/add',	upload.single('uploadedImage'), ctrlDetails.addDetails);
router.delete('/delete/:id', ctrlDetails.deleteDetails);

module.exports = router;