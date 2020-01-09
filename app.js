let express = require('express');
let router = require('./controller/router');

let rootPath = ''+__dirname;

//Start server
app = express();
router(app, rootPath);

console.log("hello");

/*
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
*/


