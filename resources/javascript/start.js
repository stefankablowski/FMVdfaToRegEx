let allEntries = new Array();

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

let currentPos = 0;

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

let printLine = (entry) => {
    document.getElementById('entries').innerHTML +=
    `    
    <tr>
    <th scope="row">${entry.k}</th>
    <td>${entry.i}</td>
    <td>${entry.j}</td>
    <td>${entry.reg}</td>
  </tr>
    `

}

let startAlgorithm = ()=>{
    currentPos = 0;
    //Do some complicated parsing stuff i dont understand but it just works
    //Note here: never use ":" inside values
    let badJSONdfa = String(document.getElementById('inputDFA').value).replace(/(\r\n|\n|\r)/gm, "");
    goodJSONdfa = badJSONdfa.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
    parsedDFA = JSON.parse(goodJSONdfa);
    dfaToRegEx(parsedDFA);
}



let nextStep = ()=>{
    printLine(allEntries[currentPos]);
    if(currentPos < allEntries.length) {currentPos++;}
}



document.getElementById('startAlgorithm').addEventListener('click',startAlgorithm);
document.getElementById('nextStep').addEventListener('click',nextStep);
