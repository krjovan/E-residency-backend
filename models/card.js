var mongoose = require( 'mongoose' );

var cardSchema = new mongoose.Schema({
  card_code: {
    type: String,
	unique: true,
    required: true
  },
  issue_date: {
    type: Date,
    required: true
  },
  expire_date: {
    type: Date,
    required: true
  },
  application_status_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

const Card = module.exports = mongoose.model('Card', cardSchema);