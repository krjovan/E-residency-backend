var mongoose = require('mongoose');
var Application_status = mongoose.model('Application_status');

module.exports.getAll = function(req, res) {
	Application_status.find()
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
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