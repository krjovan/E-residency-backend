var mongoose = require( 'mongoose' );

var applicationStatusSchema = new mongoose.Schema({
  application_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  datetime_status_change: {
    type: Date,
	default: Date.now,
    required: false
  }
});

const Application_status = module.exports = mongoose.model('Application_status', applicationStatusSchema);