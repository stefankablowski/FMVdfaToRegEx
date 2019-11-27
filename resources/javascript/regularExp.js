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
        //console.log(`simplifying right now: ${this.toString()}`)
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
                        return this.right.simplify();
                    }
                }
                //(a)*a
                else if(this.left.type === 'kleene'){
                    if(this.left.toString() === `(${this.right.toString()})*`){
                        return this.left.simplify();
                    }
                }
                else{
                    //return this.left.simplify().concat(this.right.simplify());
                    return new RegularExp(null, 'concat', this.left.simplify(),this.right.simplify());
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
                return this.left.simplify();
            }else{
                //return this.left.simplify().kleene();
                return new RegularExp(null, 'kleene', this.left.simplify(), null);
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
                //return this.left.simplify().disjun(this.right.simplify());
                return new RegularExp(null, 'disjun', this.left.simplify(), this.right.simplify());
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


