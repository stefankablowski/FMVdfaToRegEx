let express = require('express');
let path = require('path');

module.exports = (app)=>{

    console.log(process.cwd());

    //Setup server
    app.listen(1234, '0.0.0.0');

    //Set up middleware for static files
    app.use('/dfa/resources', express.static('resources'));
    
    //Serve HTML
    app.get('/dfa',(req, res)=>{
        res.sendFile('index.html',{ root: './'});
    });
    app.get('/dfa/',(req, res)=>{
        res.sendFile('index.html',{ root: './'});
    });
}