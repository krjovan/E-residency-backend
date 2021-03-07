const express= require('express');
const mongoose=require('mongoose');
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('./config/database');
const logger = require('morgan');
var passport = require('passport');

//ucitavamo servise
const users=require('./routes/users');
const status=require('./routes/status');
const location = require('./routes/location');
const application = require('./routes/application');
const details = require('./routes/details');
const application_status = require('./routes/application_status');
const card = require('./routes/card');


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

//staticki direktorijum bice ./images
app.use('/images', express.static('images'));

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());

//navodimo nasted putanje iz servisa
app.use('/users',users);
app.use('/status',status);
app.use('/location',location);
app.use('/application',application);
app.use('/details',details);
app.use('/application-status',application_status);
app.use('/card',card);

const port= process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("server started on port: "+port);
});