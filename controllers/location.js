var mongoose = require('mongoose');
var Location = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.getAll = function(req, res) {
	const regex = new RegExp(req.query.search, 'i')
	Location.find({country: {$regex: regex}})
	.sort({ _id: -1 })
	.exec(function (err, doc) {
		console.log(doc);
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
};

module.exports.addLocation = function(req, res) {
	if(!req.body.country || !req.body.city || !req.body.street || !req.body.street_number || !req.body.contact_email) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
    return;
	}

  Location.findOne({contact_email: req.body.contact_email}, function(err, location){
    if(err) {
      console.log(err);
    }
    if(location) {
      sendJSONresponse(res, 400, {
        "message": "Contact email taken"
      });
      return;
    } else {
      var location = new Location();

      location.country = req.body.country;
      location.city = req.body.city;
	  location.street = req.body.street;
      location.street_number = req.body.street_number;
      location.contact_email = req.body.contact_email;

	  res.status(200);
	  res.json({
	    "message" : "Location created successfully"
	  });
      location.save();
    }
  });
};

module.exports.updateLocation = function(req, res) {
	if(!req.body.country || !req.body.city || !req.body.street || !req.body.street_number || !req.body.contact_email) {
		sendJSONresponse(res, 400, {
		  "message": "All fields required"
		});
		return;
	}
	Location.findOneAndUpdate({_id: req.params.id},{
		$set:{
		  country: req.body.country,
		  city: req.body.city,
		  street: req.body.street,
		  street_number: req.body.street_number,
		  contact_email: req.body.contact_email
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

module.exports.deleteLocation = function(req, res) {
  Location.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
};


module.exports.getLocationsByPagination = function(req, res) {
	const pageOptions = {
		page: parseInt(req.query.page, 10) || 0,
		limit: parseInt(req.query.limit, 10) || 10
	}

	Location.find()
	.sort({ _id: -1 })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, doc) {
        if(err) { res.status(500).json(err); return; };
        res.status(200).json(doc);
    });
}

module.exports.numberOfLocations = function(req, res) {
	Location.countDocuments()
    .exec(function (err, doc) {
        if(err) { res.status(500).json(err); return; };
        res.status(200).json({"numberOfLocations":doc});
    });
}