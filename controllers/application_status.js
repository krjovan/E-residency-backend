var mongoose = require('mongoose');
var Application_status = mongoose.model('Application_status');
var Status = mongoose.model('Status');

module.exports.getAll = function(req, res) {
	Application_status.find()
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.getStatusByApplicationId = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Application_status.aggregate([
		{   
			$match: {
				application_id: id
			}
		},
		{
			$lookup:
			{
				from: "status",
				localField: "status_id",
				foreignField: "_id",
				as: "status"
			}
		},
		{ $unwind : "$status" }
	]).exec( (err, list) => {
        if (err) throw err;
        console.log(list);
		res.status(200);
		res.json(list);
    }); 
};


module.exports.getApplicationsByStatusType = function(req, res) {
	if(!req.body.status_type) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	Status.findOne({status_type: req.body.status_type}, function(err, status) {
		Application_status.aggregate([
		{   
			$match: {
				status_id: status._id
			}
		},
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
			res.status(200);
			res.json(list);
		}); 
	});
	/*
	Application_status.aggregate([
		{   
			$match: {
				application_id: id
			}
		},
		{
			$lookup:
			{
				from: "status",
				localField: "status_id",
				foreignField: "_id",
				as: "status"
			}
		}
	]).exec( (err, list) => {
        if (err) throw err;
        console.log(list);
		res.status(200);
		res.json(list);
    }); */
};

module.exports.addApplicationStatus = function(req, res) {

	if(!req.body.application_id || !req.body.status_id) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	
	var applicationStatus = new Application_status();
	
	applicationStatus.application_id = req.body.application_id;
	applicationStatus.status_id = req.body.status_id;
	applicationStatus.save();
	
	res.status(200);
	res.json({
		"message" : "Application status created successfully"
	});
};

module.exports.deleteApplicationStatus = function(req, res) {
  Application_status.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};