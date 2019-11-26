module.exports = class RegularExp{
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
            if(this.left.isEmptySet() || this.right.isEmptySet()){
                return RegularExp.getEmptySet();
            }else if(this.left.isEpsilon() || this.right.isEpsilon()){
                //NEED TO FIX
                console.log('fix me');
                return RegularExp.getEpsilon();
            }else{
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
                    return this;
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
                return this;
            }
            
        }else if(this.type === 'disjun'){
            if(this.left.isEpsilon() || this.right.isEpsilon()){

            }
            //a+a
            else if(this.left.toString() === this.right.toString()){
                return this.left.simplify();
            }
            return this;
        }
    }

    isEmptySet(){
        return ((this.type === 'base') && (this.value==='∅'));

    }
    isEpsilon(){
        return ((this.type === 'base') && (this.value==='ɛ'));
    }
}

