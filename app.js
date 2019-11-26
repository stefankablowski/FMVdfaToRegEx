let express = require('express');
let router = require('./controller/router');
let data = require('./model/data');

//Start server
app = express();
router(app, data);

console.log("hello");

data({
    initial: '1',
    states: {
        1: {
            on: {
                a: '2',
                b: '3',
            }
        },
        2: {
            on: {
                a: '2',
                b: '3',
            }
        },
        3: {
        }
    },
    final: [3],
});


