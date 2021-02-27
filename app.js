const express= require('express');
const mongoose=require('mongoose');
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('./config/database');
const logger = require('morgan');
var passport = require('passport');
const multer = require('multer');
var fileExtension = require('file-extension');




//ucitavamo servise
const users=require('./routes/users');
const status=require('./routes/status');
const location = require('./routes/location');
const application = require('./routes/application');
const details = require('./routes/details');


const app=express();
process.env.TZ = 'Europe/Belgrade';
//konektujemo se na bazu
mongoose.connect(config.database,{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log('Connected to detabase: '+config.database);
});
mongoose.connection.on('error',(err)=>{
    console.log('Error with connection to db: '+err);
});

require('./config/passport');

app.set('views', __dirname + '/public');
app.set('view engine', 'html');

//staticki direktorijum bice ./public
//app.use(express.static(path.join(__dirname,'public')));
//gommila postavki nodejs servera

app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
app.use(logger('dev'));
app.use(bodyParser.json());

//navodimo nasted putanje iz servisa
app.use('/users',users);
app.use('/status',status);
app.use('/location',location);
app.use('/application',application);
app.use('/details',details);

var Details = mongoose.model('Details');

// Configure Storage
var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'images')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error 
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success 
        cb(undefined, true)
    }
});

app.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file
    console.log(req);
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
	
	res.status(200);
	res.json({
		"message" : "Details created successfully"
	});
	details.save();
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

app.get('**',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

//startujemo server na portu 8080
const port= process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("server started on port: "+port);
});