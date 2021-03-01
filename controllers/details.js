var mongoose = require('mongoose');
var Details = mongoose.model('Details');
var Status = mongoose.model('Status');
var Application_status = require('../models/application_status');

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

module.exports.getApplicationWithDetails = function(req, res) {
	Details.aggregate([
		{
			$lookup:
			{
				from: "applications",
				localField: "application_id",
				foreignField: "_id",
				as: "application"
			}
		},
		{ $unwind : "$application" }
	]).exec( (err, list) => {
        if (err) throw err;
        console.log(list);
		res.status(200);
		res.json(list);
    }); 

	
};


module.exports.getApplicationWithDetailsById = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Details.aggregate([
		{   
			$match: {
				application_id: id
			}
		},
		{
			$lookup:
			{
				from: "locations",
				localField: "pick_up_location_id",
				foreignField: "_id",
				as: "location"
			}
		},
		{ $unwind : "$location" }
	]).exec( (err, list) => {
        if (err) throw err;
		res.status(200);
		res.json(list[0]);
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
	
	var applicationStatus = new Application_status();
	
	Status.findOne({status_type: 'submitted'}, function(err, doc) {
		applicationStatus.application_id = req.body.application_id;
		applicationStatus.status_id = doc._id;
		applicationStatus.save();
	});
	
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

