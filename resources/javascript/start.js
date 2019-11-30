let dfa = {
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
}

window.onload = ()=>{
    let example1 = 
    `{
        initial: "1",
        states: {
            1: {
                on: {
                    a: "2",
                    b: "3"
                }
            },
            2: {
                on: {
                    a: "2",
                    b: "3"
                }
            },
            3: {
            }
        },
        final:[ "3" ]
    }`
    document.getElementById('inputDFA').value = example1;
}

let startAlgorithm = ()=>{
    //Do some complicated parsing stuff i dont understand but it just works
    //Note here: never use ":" inside values
    let badJSONdfa = String(document.getElementById('inputDFA').value).replace(/(\r\n|\n|\r)/gm, "");
    goodJSONdfa = badJSONdfa.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
    parsedDFA = JSON.parse(goodJSONdfa);
    dfaToRegEx(parsedDFA);
}

document.getElementById('startAlgorithm').addEventListener('click',startAlgorithm);

