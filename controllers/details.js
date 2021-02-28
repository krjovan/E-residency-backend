var mongoose = require('mongoose');
var Details = mongoose.model('Details');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


module.exports.getAll = function(req, res) {
	Details.find()
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.addDetails = function(req, res) {

	if(!req.body.given_name || !req.body.surname || !req.body.country_of_birth || !req.body.citizenship || !req.body.date_of_birth || 
		!req.body.sex || !req.body.personal_identification_code || !req.body.pick_up_location_id || !req.body.application_id) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	const file = req.file

    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
	
	var details = new Details();

	details.given_name = req.body.given_name;
	details.surname = req.body.surname;
	details.country_of_birth = req.body.country_of_birth;
	details.citizenship = req.body.citizenship;
	details.date_of_birth = req.body.date_of_birth;
	details.sex = req.body.sex;
	details.personal_identification_code = req.body.personal_identification_code;
	details.pick_up_location_id = req.body.pick_up_location_id;
	details.application_id = req.body.application_id;
	details.photo_code = 'http://localhost:8080/images/' + req.file.filename;
	details.save();
	
	res.status(200);
	res.json({
		"message" : "Details created successfully"
	});
};

module.exports.deleteDetails = function(req, res) {
  Details.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};

