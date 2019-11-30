class RegularExp {
    constructor(value = null, type = 'base', left = null, right = null) {
        if (value != null) {
            this.value = value;
        }
        this.type = type;
        this.left = left;
        this.right = right;
    }

    /* Takes an array of strings and returns object of regex containing these strings */
    static createAlphabet(array) {
        let result = {}
        array.forEach(element => {
            result[element] = new RegularExp(element);
        });
        return result;
    }

    static equals(regex1, regex2){
        if(regex1.type === regex2.type){
            if(regex1.type === 'base'){
                return (regex1.value === regex2.value);
            }else if(regex1.type === 'concat'){
                return RegularExp.equals(regex1.left,regex2.left) && RegularExp.equals(regex1.right,regex2.right);
            }else if(regex1.type === 'disjun'){
                return RegularExp.equals(regex1.left,regex2.left) && RegularExp.equals(regex1.right,regex2.right);
            }else if(regex1.type === 'kleene'){
                return RegularExp.equals(regex1.left,regex2.left);
            }
        }else{
            return false;
        }
    }

    static getEpsilon() {
        return new RegularExp('ɛ');
    }

    static getEmptySet() {
        return new RegularExp('∅');
    }

    toString() {
        if (this.type === 'base') {
            return this.value;
        }
        else if (this.type === 'concat') {
            return '(' + this.left.toString() + this.right.toString() + ')';
        } else if (this.type === 'kleene') {
            return '(' + this.left.toString() + ')*';
        } else if (this.type === 'disjun') {
            return '(' + this.left.toString() + "+" + this.right.toString() + ')';
        } else {
            console.log('error error error tostring');
        }
    }

    concat(regex2) {
        return new RegularExp(null, 'concat', this, regex2);
    }

    kleene() {
        return new RegularExp(null, 'kleene', this, null);
    }

    disjun(regex2) {
        return new RegularExp(null, 'disjun', this, regex2);
    }

    simplifyMax(){
        let lastSimplification = this;
        let newSimplification = this.simplify();
        while(!(RegularExp.equals(lastSimplification,newSimplification))){
            lastSimplification = newSimplification;
            newSimplification = newSimplification.simplify();
        }
        return newSimplification;
    }

    simplify() {
        if (this.type === 'base') {
            return new RegularExp(this.value);
        }

        else if (this.type === 'concat') {
            return this.simplifyConcat();
        } else if (this.type === 'kleene') {
            return this.simplifyKleene();
        } else if (this.type === 'disjun') {
            return this.simplifyDisjun();
        }
        console.log('Simplifying invalid object');
    }

    simplifyDisjun() {
        // ∅ + ∅ = ∅
        if (this.left.isEmptySet() && this.right.isEmptySet()) {
            return RegularExp.getEmptySet();
        }

        // ∅ + a = a
        else if (this.left.isEmptySet() && !(this.right.isEmptySet())) {
            return this.right.simplify();
        }

        // a + ∅ = a
        else if (!(this.left.isEmptySet()) && this.right.isEmptySet()) {
            return this.left.simplify();
        }

        //a+a
        else if (RegularExp.equals(this.left,this.right)) {
            return this.left.simplify();
        }

        //(a)* + a = (a)*
        else if (this.left.type === 'kleene' && RegularExp.equals(this.left.left,this.right)) {
            return this.left.simplify();
        }

        // a + (a)* = (a)*
        else if (this.right.type === 'kleene' && RegularExp.equals(this.left,this.right.left)) {
            return this.right.simplify();
        }

        //Nothing else worked
        return this.left.simplify().disjun(this.right.simplify());

    }

    simplifyConcat() {
        //∅a = ∅
        if (this.left.isEmptySet() || this.right.isEmptySet()) {
            return RegularExp.getEmptySet();
        }

        //ɛɛ = ɛ
        else if (this.left.isEpsilon() && this.right.isEpsilon()) {
            return RegularExp.getEpsilon();
        }

        //ɛa = a
        else if (this.left.isEpsilon() && !(this.right.isEpsilon())) {
            return this.right.simplify();
        }

        //aɛ = a
        else if (!(this.left.isEpsilon()) && this.right.isEpsilon()) {
            return this.left.simplify();
        }

        //(a)*(a)* = (a)*
        else if ((this.left.type === 'kleene')
            && (this.right.type === 'kleene')
            && (RegularExp(this.left, this.right))) {
            return this.left.simplify();
        }

        //Nothing else worked
        return this.left.simplify().concat(this.right.simplify());

    }

    simplifyKleene() {
        //(ɛ)* = ɛ
        if (this.left.isEpsilon()) {
            return RegularExp.getEpsilon();
        }

        //(∅)* = ɛ
        else if (this.left.isEmptySet()) {
            return RegularExp.getEpsilon();
        }

        //((a)*)*
        else if (this.left.type === 'kleene') {
            return this.left.simplify();
        }

        //((ɛ+a))*
        else if ((this.left.type === 'disjun') && (this.left.left.isEpsilon()) && !(this.left.right.isEpsilon())) {
            return this.left.right.simplify().kleene();
        }

        //((a+ɛ))*
        else if ((this.left.type === 'disjun') && !(this.left.left.isEpsilon()) && (this.left.right.isEpsilon())) {
            return this.left.left.simplify().kleene();
        }

        //nothing else worked
        return this.left.simplify().kleene();
    }

    isEmptySet() {
        return ((this.type === 'base') && (this.value === '∅'));

    }
    isEpsilon() {
        return ((this.type === 'base') && (this.value === 'ɛ'));
    }
}


