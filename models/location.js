var mongoose = require( 'mongoose' );

var locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  street_number: {
    type: String,
    required: true
  },
  contact_email: {
    type: String,
	unique: true,
    required: true
  }
});

const Location = module.exports = mongoose.model('Location', locationSchema);