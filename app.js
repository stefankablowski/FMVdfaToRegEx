let express = require('express');
let router = require('./controller/router');
let data = require('./model/data');

//Start server
app = express();
router(app, data);

console.log("hello");

data();


