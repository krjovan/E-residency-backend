var mongoose = require('mongoose');
var Card = require('../models/card');
var Application_status = mongoose.model('Application_status');
var Status = mongoose.model('Status');
var Application = mongoose.model('Application');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

function makeid(length) {
   var result           = '';
   var characters       = '0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

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

module.exports.getSubmittedApplications = function(req, res) {
	Application_status.aggregate([
		{
			$group :
				{
					_id : {application_id:"$application_id"},
					count: { $sum: 1 }
				}
		},
		{
			$lookup:
			{
				from: "applications",
				localField: "_id.application_id",
				foreignField: "_id",
				as: "application"
			}
		},
		{ $unwind : "$application" },
		{
			$match: { "count": 1 }
		},
		{
			$project: {
				'_id': 0,
				'application': 1
			}
		},
	
	]).exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.getProcessingApplications = function(req, res) {
	Application_status.aggregate([
		{
			$group :
				{
					_id : {application_id:"$application_id"},
					count: { $sum: 1 }
				}
		},
		{
			$lookup:
			{
				from: "applications",
				localField: "_id.application_id",
				foreignField: "_id",
				as: "application"
			}
		},
		{ $unwind : "$application" },
		{
			$match: { "count": 2 }
		},
		{
			$project: {
				'_id': 0,
				'application': 1
			}
		},
	
	]).exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};


module.exports.getApplicationsByStatusType = function(req, res) {
	
	console.log(req.query.status_type);
	if(!req.query.status_type) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	Status.findOne({status_type: req.query.status_type}, function(err, status) {
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
};

module.exports.addApplicationStatus = function(req, res) {

	if(!req.body.application_id || !req.body.status_type) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}

	Status.findOne({status_type: req.body.status_type}, function(err, status) {
		var applicationStatus = new Application_status();
		var application_status_id = '';
	
		applicationStatus.application_id = req.body.application_id;
		applicationStatus.status_id = status._id;
		applicationStatus.save(function(err,result) {
			application_status_id = result.id;
		});
		
		let transport = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
			   user: '02231501925661',
			   pass: '61cbb1dce65639'
			}
		});
		
		if (req.body.status_type === 'rejected') {
			var application_id = mongoose.Types.ObjectId(req.body.application_id);
			Application.findOne({_id: application_id}, function(err, application){
				if(err) {
					console.log(err);
				}

				if(application) {
					var user_id = mongoose.Types.ObjectId(application.user_id);
					User.findOne({_id: user_id}, function(err, user){
						if(err) {
						  console.log(err);
						}
						if(user) {
							var mailOptions = {
								from: 'no-reply@e-residency.com',
								to: user.email,
								subject: 'Rejected e-residency application',
								html: `<p>Dear Sir or Madam,</p>
									   <p>Your application for e-residency was rejected.</p>
									   <p>Be free to apply again after 6 months.</p>
									   <p>E-residency team</p>
									   <p>Email: contact@e-residency.com</p>
									   <p>Web: <a href="http://localhost:4200/home">www.e-residency.com</a></p>`
							};
			
							transport.sendMail(mailOptions, function(err, info) {
								if (err) {
								  console.log(err)
								} else {
								  console.log(info);
								  res.status(200);
								  res.json({
									"message" : "Email sent successfully!"
								  });
								}
							});
						  
						  
						} else {
						  sendJSONresponse(res, 404, {
							"message": "No user found!"
						  });
						  return;
						}
					});
				} else {
				  sendJSONresponse(res, 404, {
					"message": "No application found!"
				  });
				  return;
				}
			});
		} else if (req.body.status_type === 'accepted') {
			var application_id = mongoose.Types.ObjectId(req.body.application_id);
			Application.findOne({_id: application_id}, function(err, application){
				if(err) {
					console.log(err);
				}

				if(application) {
					var user_id = mongoose.Types.ObjectId(application.user_id);
					User.findOne({_id: user_id}, function(err, user){
						if(err) {
						  console.log(err);
						}
						if(user) {
							var mailOptions = {
								from: 'no-reply@e-residency.com',
								to: user.email,
								subject: 'Accepted e-residency application',
								html: `<p>Dear Sir or Madam,</p>
									   <p>Your application for e-residency was accepted.</p>
									   <p>You will be contacted by your chosen embassy within a few weeks.</p>
									   <p>E-residency team</p>
									   <p>Email: contact@e-residency.com</p>
									   <p>Web: <a href="http://localhost:4200/home">www.e-residency.com</a></p>`
							};
			
							transport.sendMail(mailOptions, function(err, info) {
								if (err) {
								  console.log(err)
								} else {
								  console.log(info);
								  res.status(200);
								  res.json({
									"message" : "Email sent successfully!"
								  });
								}
							});
							
							Card.update({"user_id": mongoose.Types.ObjectId(user._id)}, {"$set": {"active": false}}, {"multi": true}, 
								(err, writeResult) => {
									var card = new Card();

									card.card_code = makeid(15);
									card.issue_date = new Date();
									var dateNow = new Date();
									dateNow.setFullYear(dateNow.getFullYear() + 1);
									card.expire_date = dateNow;
									card.application_status_id = mongoose.Types.ObjectId(application_status_id);;
									card.user_id = user._id;
									card.active = true;
									card.save();
								}
							);
							
							
													  
						} else {
						  sendJSONresponse(res, 404, {
							"message": "No user found!"
						  });
						  return;
						}
					});
				} else {
				  sendJSONresponse(res, 404, {
					"message": "No application found!"
				  });
				  return;
				}
			});
		} else {
			console.log('Processing');
		}

		res.status(200);
		res.json({
			"message" : "Application status created successfully"
		});
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