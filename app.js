let express = require('express');
let router = require('./controller/router');


//Start server
app = express();
router(app);

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


