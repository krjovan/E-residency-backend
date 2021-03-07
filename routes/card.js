var express = require('express');
var router = express.Router();
const Card = require('../models/card');

var ctrlCard = require('../controllers/card');

router.get('/all', ctrlCard.getAll);
router.post('/add', ctrlCard.addCard);
router.put('/update/:id', ctrlCard.updateCard);
router.delete('/delete/:id', ctrlCard.deleteCard);

module.exports = router;