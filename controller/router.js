let express = require('express');
let path = require('path');

module.exports = (app)=>{

    //Setup server
    app.listen(1234, '0.0.0.0');

    //Set up middleware for static files
    app.use('/dfa/resources', express.static('resources'));
    
    //Serve HTML
    app.get('/dfa',(req, res)=>{
        res.sendFile('index.html',{ root: process.cwd()});
    });
    app.get('/dfa/',(req, res)=>{
        res.sendFile('index.html',{ root: process.cwd()});
    });
}