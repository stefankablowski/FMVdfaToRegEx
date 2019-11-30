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

let clearLines = ()=>{
    document.getElementById('entries').innerHTML = "";
}

let startAlgorithm = ()=>{
    document.getElementById('nextStep').classList.add('hidden');
    clearLines();
    currentPos = 0;
    allEntries.splice(0,allEntries.length);
    //Do some complicated parsing stuff i dont understand but it just works
    //Note here: never use ":" inside values
    let badJSONdfa = String(document.getElementById('inputDFA').value).replace(/(\r\n|\n|\r)/gm, "");
    goodJSONdfa = badJSONdfa.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
    parsedDFA = JSON.parse(goodJSONdfa);
    dfaToRegEx(parsedDFA);

    if(document.getElementById('goInStepsBox').checked){
        document.getElementById('nextStep').classList.remove('hidden');
    }
    if(document.getElementById('simplifyBox').checked){

    }


    
}



let nextStep = ()=>{
    if(currentPos < allEntries.length) {
        printLine(allEntries[currentPos]);
        //Auto-scroll
        var elem = document.querySelector('.my-custom-scrollbar');
        elem.scrollTop = elem.scrollHeight;
        currentPos++;
    }
    console.log(currentPos);
    console.log(allEntries.length);
}



document.getElementById('startAlgorithm').addEventListener('click',startAlgorithm);
document.getElementById('nextStep').addEventListener('click',nextStep);
document.getElementById('goInStepsBox').addEventListener('click',()=>{document.getElementById('nextStep').classList.add('hidden');})