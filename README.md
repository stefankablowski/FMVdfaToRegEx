# FMVdfaToRegEx
A simple algorithm to create a regular expression out of a dfa

How to use
    //Create alphabet
    let alphabet = RegularExp.createAlphabet(['a','b','∅','ε']);

    //Sample regular expression
    let myexp = alphabet.a.concat(alphabet.b).concat(alphabet.a);
    console.log(myexp.toString());


Build your DFA here. Use: export to clipboard -> xstate
https://sketch.systems/anon/sketch/new