let express = require('express');
let path = require('path');

module.exports = (app, rootPath)=>{

	console.log("current pwd" + process.cwd());

    //Setup server
    app.listen(1234, '0.0.0.0');

    //Set up middleware for static files
    app.use('/dfa/resources', express.static(rootPath + '/resources'));
    
    //Serve HTML
    app.get('/dfa',(req, res)=>{
	res.sendFile('index.html', { root: path.join(__dirname, '..') });
    });
    app.get('/dfa/',(req, res)=>{
	res.sendFile('index.html', { root: path.join(__dirname, '..') });
    });
}