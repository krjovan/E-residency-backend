var mongoose = require( 'mongoose' );

var detailsSchema = new mongoose.Schema({
  given_name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  country_of_birth: {
    type: String,
    required: true
  },
  citizenship: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  personal_identification_code: {
    type: String,
    required: true
  },
  photo_code: {
    type: String,
    required: false
  },
  pick_up_location_id: {
    type: String,
    required: true
  },
  application_id: {
    type: String,
    required: true
  }
});

const Details = module.exports = mongoose.model('Details', detailsSchema);