module.exports = class RegularExp{
    constructor(type = 'base', value = null, left = null, right = null){
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
            result[element] = new RegularExp('base',element);
        });
        return result;
    }

    static getEpsilon(){
        return new RegularExp('base','ɛ');
    }

    static getEmptySet(){
        return new RegularExp('base','∅');
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
        return new RegularExp('concat', null, this, regex2);
    }

    kleene(){
        return new RegularExp('kleene', null, this, null);
    }

    disjun(regex2){
        return new RegularExp('disjun', null, this, regex2);
    }

    simplify(){
        return this;
    }
}

