const RegularExp = require('./RegularExp');
const Machine = require('xstate').Machine;
//import { Machine } from 'xstate';

module.exports = () => {
    let dfa = Machine({
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
                on: {
                }
            }
        }
    });

    console.log("should be 2: " + dfa.transition(1, 'a').value);
    console.log('∅ε');

    let a = new RegularExp('a');
    let b = new RegularExp('b');

    let alphabet = [a,b]

    let myexp = RegularExp.concat(a,b);
    myexp = RegularExp.concat(myexp,b);
    console.log(myexp.toString());

    return true;

}