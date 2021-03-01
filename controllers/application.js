var mongoose = require('mongoose');
var Application = mongoose.model('Application');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.getAll = function(req, res) {
	const regex = new RegExp(req.query.search, 'i')
	Application.find({type_of_application: {$regex: regex}})
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};


module.exports.getUserApplications = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Application.aggregate([
		{   
			$match: {
				user_id: id
			}
		},
		{ $sort : { _id: -1 } }
	]).exec( (err, list) => {
        if (err) throw err;
		res.status(200);
		res.json(list);
    }); 
};

module.exports.addApplication = function(req, res) {
	if(!req.body.type_of_application || !req.body.motivation || !req.body.user_id) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}

	var application = new Application();

	application.type_of_application = req.body.type_of_application;
	application.motivation = req.body.motivation;
	application.user_id = req.body.user_id;

	
	application.save(function(err,result) {
		res.status(200);
		res.json({
			"application_id" : result.id
		});
	});
};

module.exports.deleteApplication = function(req, res) {
  Application.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};