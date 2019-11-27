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

class RegularExp{
    constructor(value = null, type = 'base', left = null, right = null){
        if(value != null){
            this.value = value;
            //Use ɛ for Epsilon and ∅ for empty set
        }
        this.type = type;
        //Left and right will store binary operations
        //On unary operations left will store the regex
        this.left = left;
        this.right = right;
    }

    /*Takes an array of strings 
    and returns object of regex containing these strings
    */
    static createAlphabet(array){
        let result = {}
        array.forEach(element => {
            result[element] = new RegularExp(element);
        });
        return result;
    }

    static getEpsilon(){
        return new RegularExp('ɛ');
    }

    static getEmptySet(){
        return new RegularExp('∅');
    }

    toString(){
        if(this.type === 'base'){
            return this.value;
        }
        else if(this.type === 'concat'){
            return this.left.toString() + this.right.toString();
        }else if(this.type === 'kleene'){
            return '(' + this.left.toString() + ')*';
        }else if(this.type === 'disjun'){
            return this.left.toString() + "+" + this.right.toString();
        }
    }

    concat(regex2){
        return new RegularExp(null, 'concat', this, regex2);
    }

    kleene(){
        return new RegularExp(null, 'kleene', this, null);
    }

    disjun(regex2){
        return new RegularExp(null, 'disjun', this, regex2);
    }

    simplify(){
        if(this.type === 'base'){
            return new RegularExp(this.value);
        }
        else if(this.type === 'concat'){
            //emptySet concat something = empty set
            if(this.left.isEmptySet() || this.right.isEmptySet()){
                return RegularExp.getEmptySet();
            //Epsilon concat epsilon = epsilon
            }else if(this.left.isEpsilon() && this.right.isEpsilon()){
                return RegularExp.getEpsilon();
            //Epsilon concat something = something
            }else if(this.left.isEpsilon() && !(this.right.isEpsilon())){
                return this.right.simplify();
            //a concat epsilon = a
            }else if(!(this.left.isEpsilon()) && this.right.isEpsilon()){
                return this.left.simplify();
            }else
            {
                //(a)*(a)*
                if(     (this.left.toString() === this.right.toString())
                        && (this.left.type === 'kleene' && this.right.type === 'kleene')
                ){
                    return this.left.simplify();
                }
                //a(a)* = (a)*
                if(this.right.type === 'kleene'){
                    if(`(${this.left.toString()})*` === this.right.toString()){
                        return new RegularExp(null, 'kleene', this.left.simplify(), null);
                    }
                }
                //(a)*a
                else if(this.left.type === 'kleene'){
                    if(this.left.toString() === `(${this.right.toString()})*`){
                        return new RegularExp(null, 'kleene', this.right.simplify(), null);
                    }
                }
                else{
                    return this.left.simplify().concat(this.right.simplify());
                }
                
            }
        }else if(this.type === 'kleene'){
            //epsilon*
            if(this.left.isEpsilon()){
                return RegularExp.getEpsilon();
            }else if(this.left.isEmptySet()){
                //Not a bug, emptyset* is epsilon
                return RegularExp.getEpsilon();
            }
            //((a)*)*
            else if(this.left.type === 'kleene'){
                return new RegularExp(null, 'kleene', this.left.left);
            }else{
                return this.left.simplify().kleene();
            }
            
        }else if(this.type === 'disjun'){
            if(this.left.isEpsilon() && this.right.isEpsilon()){
                return RegularExp.getEpsilon();
            }
            //emptySet + emptySet = emptySet
            else if(this.left.isEmptySet() && this.right.isEmptySet()){
                return RegularExp.getEmptySet();
            //emptySet + a = a
            }else if(this.left.isEmptySet() && !(this.right.isEmptySet())){
                return this.right.simplify();
            //a + emptySet = a
            }else if(!(this.left.isEmptySet()) && this.right.isEmptySet()){
                return this.left.simplify();
            }
            //a+a
            else if(this.left.toString() === this.right.toString()){
                return this.left.simplify();
            //(a)*+a = (a)*
            }else if(this.left.toString() === `(${this.right.toString()})*`){
                return this.left.simplify();
            //a+(a)* = (a)*
            }else if(`(${this.left.toString()})*`  ===  this.right.toString()){
                return this.right.simplify();
            }else{
                return this.left.simplify().disjun(this.right.simplify());
            }
            
        }
    }

    isEmptySet(){
        return ((this.type === 'base') && (this.value==='∅'));

    }
    isEpsilon(){
        return ((this.type === 'base') && (this.value==='ɛ'));
    }
}

(dfa) => {

    /* Returns an array of regular expressions from i to j*/
    let iToJ = (i,j)=>{
        //Only loop through transitions starting at state i
        let currentState = dfa.states[i].on;

        //List of all found regex
        let regs = new Array();
        
        //Make sure path is not empty
        if(!(currentState === null || currentState === undefined)){

            //Find transitions directing to state j
            Object.entries(currentState).forEach(([symbol,nextState])=>{
                if(String(nextState) === String(j)){
                    regs.push(new RegularExp(symbol));
                }
            });
        }

        
        //Case: i = j
        if(i === j){
            regs.push(RegularExp.getEpsilon());
        }

        if(!regs.length){
            regs.push(RegularExp.getEmptySet());
        }
        //Disjun all paths
        if(regs.length > 1){
            result = regs[0];
            for(let x = 1; x < regs.length; x++){
                result = result.disjun(regs[x]);
            }
            return result;
        }else{
            return regs[0];
        }
    }

    let numberOfStates = Object.keys(dfa.states).length;
    console.log(`Number of States : ${numberOfStates}`)

    //contains regContainer[k][i][j]
    let regContainer = new Array(numberOfStates+1);
    
    //Create 3d array
    for (let i = 0; i < numberOfStates+1; i++) {
        regContainer[i] = new Array(numberOfStates);
        for (let j = 0; j < numberOfStates; j++) {
            regContainer[i][j] = new Array(numberOfStates);
            for(let pr = 0; pr < numberOfStates; pr++){
                regContainer[i][j][pr] = {toString: function(){
                    return "-"
                }}
            }
        }
    }

    let setRegAt = (regex,k,i,j)=>{
        regContainer[k][i-1][j-1] = regex;
    }

    let getRegAt = (k,i,j)=>{
        return regContainer[k][i-1][j-1];
    }
    let printarray = ()=>{
        for(let k = 0; k <= numberOfStates; k++){
            console.log(`--------------- k = ${k} --------------`)
            for(let i = 1; i <= numberOfStates; i++){
                for(let j = 1; j <= numberOfStates; j++){
                    console.log(`${k}${i}${j}: ${getRegAt(k,i,j).toString()} ${getRegAt(k,i,j).simplify().toString()}`);
                }
            }
        }
    }

    //printarray();

    for(let k = 0; k <= numberOfStates; k++){
        for(let i = 1; i <= numberOfStates; i++){
            for(let j = 1; j <= numberOfStates; j++){
                //Base case
                if(k === 0){
                    console.log(`k = ${k}, i = ${i}, j = ${j}`);
                    setRegAt(iToJ(i,j),k,i,j);
                }else{
                    
                    //Known from before
                    let newReg = getRegAt(k-1,i,j);
                    //New result
                    newReg = newReg.disjun(
                        getRegAt(k-1,i,k).concat(
                            getRegAt(k-1,k,k).kleene()
                            .concat( getRegAt(k-1,k,j))
                        )
                    )
                    setRegAt(newReg,k,i,j);
                    
                }
            }
        }
    }

    printarray();

    //TESTS

    let alphabet = RegularExp.createAlphabet(['a','b','ɛ','∅']);

    let tests = {
        aConcatEpsilon: alphabet.a.concat(alphabet.ɛ),
        epsilonConcatA: RegularExp.getEpsilon().concat(alphabet.a),
        aConcatEmptySet: alphabet.a.concat(RegularExp.getEmptySet()),
        emptySetConcatA: RegularExp.getEmptySet().concat(alphabet.a),
        aConcatAkleene: alphabet.a.concat(alphabet.a.kleene()),
        aKleeneConcatA: alphabet.a.kleene().concat(alphabet.a),
        aKleeneConcatAKleene: alphabet.a.kleene().concat(alphabet.a.kleene()),

        aDisjunA: alphabet.a.disjun(alphabet.a),
        aDisjunAKleene: alphabet.a.disjun(alphabet.a.kleene()),
        aKleeneDisjunA: alphabet.a.kleene().disjun(alphabet.a),
        aDisjunEpsilon: alphabet.a.disjun(RegularExp.getEpsilon()),
        epsilonDisjunA: RegularExp.getEpsilon().disjun(alphabet.a),
        aDisjunEmptySet: alphabet.a.disjun(RegularExp.getEmptySet()),
        emptySetDisjunA: RegularExp.getEmptySet().disjun(alphabet.a),

        aKleeneKleene: alphabet.a.kleene().kleene(),
        epsilonKleene: RegularExp.getEpsilon().kleene(),
        emptySetKleene: RegularExp.getEmptySet().kleene(),
    }

    Object.entries(tests).forEach(([key,value]) => {
        console.log(`${value} \t : ${value.simplify()}`)
    });

    return true;
}

