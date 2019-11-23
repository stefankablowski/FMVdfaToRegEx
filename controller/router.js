let express = require('express');
let path = require('path');

module.exports = (app, data)=>{

    //Setup server
    app.listen(1234, '0.0.0.0');

    //Set up middleware for static files
    app.use('/uniKasselVV/resources', express.static('resources'));
    
    //Serve HTML
    app.get('/uniKasselVV',(req, res)=>{
        res.sendFile(path.resolve('index.html'));
    });
    app.get('/uniKasselVV/',(req, res)=>{
        res.sendFile(path.resolve('index.html'));
    });
    
    //Get user data
    app.get('/uniKasselVV/data',(req, res)=>{
        data()
        .then(a => {
            res.type("json");
            res.send(JSON.stringify(a));
        }
        ).catch(b =>{
            res.send("404");
        })

        
    });

}