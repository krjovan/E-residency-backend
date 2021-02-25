var mongoose = require( 'mongoose' );

var statusSchema = new mongoose.Schema({
  status_type: {
    type: String,
    unique: true,
    required: true
  }
});

const Status = module.exports = mongoose.model('Status', statusSchema);