var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
const User = require('../models/users');
const multer = require('multer');
const path=require('path');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload',
  algorithms: ['HS256']
});


var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlUser = require('../controllers/users');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


//retreving data from database
router.get('/all', ctrlUser.getAll);
router.put('/update/:id', ctrlUser.updateUser);
router.delete('/delete/:id', ctrlUser.deleteUser);


module.exports = router;