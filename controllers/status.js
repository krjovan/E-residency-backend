var mongoose = require('mongoose');
var Status = mongoose.model('Status');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.getAll = function(req, res) {
	Status.find()
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.addStatus = function(req, res) {
	if(!req.body.status_type) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  Status.findOne({status_type: req.body.status_type}, function(err, user){
    if(err) {
      console.log(err);
    }
    if(user) {
      sendJSONresponse(res, 400, {
        "message": "Status type taken"
      });
      return;
    } else {
      var status = new Status();
      status.status_type = req.body.status_type;
	  res.status(200);
	  res.json({
	    "message" : "Status created successfully"
	  });
      status.save();
    }
  });
};

module.exports.deleteStatus = function(req, res) {
  Status.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};
