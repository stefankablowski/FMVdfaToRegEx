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

    let alphabet = RegularExp.createAlphabet(['a','b','∅','ε']);

    let myexp = alphabet.a.concat(alphabet.b).concat(alphabet.a);

    console.log(myexp.toString());
    return true;
}