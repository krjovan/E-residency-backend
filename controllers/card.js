var mongoose = require('mongoose');
var Card = mongoose.model('Card');
var Application = mongoose.model('Application');
var Details = mongoose.model('Details');

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
	Card.find()
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.getUserCard = function(req, res) {
	
	if(!req.query.user_id) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	var u_id = mongoose.Types.ObjectId(req.query.user_id);
	
	Application.find({user_id: u_id})
	.limit(1)
	.sort({ _id: -1 })
	.exec(function (err, applications) {
        if(err) { res.status(500).json(err); return; };
		
		Details.findOne({application_id: applications[0]._id})
		.exec(function (err, details) {
			if(err) { res.status(500).json(err); return; };
			
			Card.findOne()
			.exec(function (err, card) {
				if(err) { res.status(500).json(err); return; };
				let response = {details, card};
				res.status(200).json(response);
			});
		});
    });
	
};

module.exports.addCard = function(req, res) {
	if(!req.body.application_status_id) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}

	var card = new Card();

	card.card_code = makeid(15);
	card.issue_date = new Date();
	
	var dateNow = new Date();
	dateNow.setFullYear(dateNow.getFullYear() + 1);
	card.expire_date = dateNow;
	card.application_status_id = req.body.application_status_id;
	card.active = true;
	
	card.save(function(err,result) {
		res.status(200);
		res.json({
			"message" : "Card created successfully!"
		});
	});
};

module.exports.updateCard = function(req, res) {
	if(!req.body.active) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}

	Card.findOneAndUpdate({_id: req.params.id},{
		$set:{
		  active: req.body.active
		}
	},
	function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}	
	});
};

module.exports.deleteCard = function(req, res) {
  Card.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};
