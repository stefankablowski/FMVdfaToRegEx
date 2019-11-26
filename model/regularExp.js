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
        return this;
    }
}

