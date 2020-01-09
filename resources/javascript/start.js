let allEntries = new Array();
let resultRegex = null;
let simplify = false;
let currentPos = 0;
let examples = {
"Simple DFA": 
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
}`,
"Big DFA":
`{
    initial: "1",
    states: {
        1: {
            on: {
                a: "2",
                b: "1"
            }
        },
        2: {
            on: {
                a: "2",
                b: "3"
            }
        },
        3: {
            on: {
                a: "4",
                b: "3"
            }
        },
        4: {
            on: {
                a: "4",
                b: "4"
            }
        }
    },
    final:[ "4" ]
}`,
"Huge DFA":
`hallo2`
}

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

    document.getElementById('inputDFA').value = examples["Simple DFA"];
    if(localStorage.getItem("lastSelection") !== null){
        document.getElementById('selectExample').value = localStorage.getItem("lastSelection");
    }
    manageSelection();
}

let printLine = (entry) => {
    if(!simplify){
        document.getElementById('entries').innerHTML +=
        `    
        <tr>
        <th scope="row">${entry.k}</th>
        <td>${entry.i}</td>
        <td>${entry.j}</td>
        <td>${entry.reg}</td>
      </tr>
        `
    }else{
        document.getElementById('entries').innerHTML +=
        `    
        <tr>
        <th scope="row">${entry.k}</th>
        <td>${entry.i}</td>
        <td>${entry.j}</td>
        <td>${entry.reg}</td>
        <td>${entry.simplified}</td>
      </tr>
        `
    }


}

let clearLines = ()=>{
    document.getElementById('entries').innerHTML = "";
}

let startAlgorithm = ()=>{

    document.getElementById('resultContainer').classList.add('hidden');
    if(document.getElementById('simplifyBox').checked){
        simplify = true;
        document.getElementById('resultContainer').classList.remove('hidden');
    }else{
        simplify = false;
    }
    document.getElementById('nextStep').classList.add('hidden');
    clearLines();
    currentPos = 0;
    allEntries.splice(0,allEntries.length);
    //Do some complicated parsing stuff i dont understand but it just works
    //Note here: never use ":" inside values
    let badJSONdfa = String(document.getElementById('inputDFA').value).replace(/(\r\n|\n|\r)/gm, "");
    goodJSONdfa = badJSONdfa.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');

    try{
        parsedDFA = JSON.parse(goodJSONdfa);
        document.getElementById('parseWentWrong').innerHTML = ""
    }
    catch{
        document.getElementById('parseWentWrong').innerHTML = 
        `<div class="alert alert-danger" role="alert" >
        <div>Check your Input. </div>
        Make sure last items do not end with comma. Make sure values are Strings.
        </div>`
    }
    
    dfaToRegEx(parsedDFA,simplify);
    document.getElementById('finalResult').innerHTML = resultRegex.simplifyMax().toString();
    

    if(document.getElementById('goInStepsBox').checked){

        document.getElementById('nextStep').classList.remove('hidden');
    }else{
        allEntries.forEach((entry)=>{printLine(entry)});
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

let manageSelection = ()=>{
    localStorage.setItem('lastSelection',document.getElementById('selectExample').value);
    if(document.getElementById('selectExample').value === 'Try it yourself'){
        console.log("try it yourself")
        
        if(localStorage.getItem("userInput") !== null){
            document.getElementById('inputDFA').value = localStorage.getItem("userInput");
        }else{
            localStorage.setItem("userInput","");
            document.getElementById('inputDFA').value = "";
        }
        
    }else{
        
        document.getElementById('inputDFA').value = examples[document.getElementById('selectExample').value];
    }
    
}



document.getElementById('startAlgorithm').addEventListener('click',startAlgorithm);
document.getElementById('nextStep').addEventListener('click',nextStep);
document.getElementById('goInStepsBox').addEventListener('click',()=>{document.getElementById('nextStep').classList.add('hidden');})
document.getElementById('selectExample').addEventListener('change',manageSelection)
document.getElementById('inputDFA').addEventListener('input',()=>{
    if(document.getElementById('selectExample').value === "Try it yourself"){
        localStorage.setItem("userInput", document.getElementById('inputDFA').value)
    }
})