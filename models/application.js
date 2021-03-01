var mongoose = require( 'mongoose' );

var applicationSchema = new mongoose.Schema({
  type_of_application: {
    type: String,
    required: true
  },
  motivation: {
    type: String,
    required: true
  },
  datetime_of_application: {
    type: Date,
	default: Date.now,
    required: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Application = module.exports = mongoose.model('Application', applicationSchema);