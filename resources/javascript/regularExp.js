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

    /*
    static equals(regex1, regex2){
        if(regex1.type === regex2.type){
            if(regex1.type === 'base'){
                if(regex1.value === regex2.value){
                    return true;
                }
            }else if(regex1.type === 'concat'){
                return RegularExp.equals(regex1.left,regex2.left) && RegularExp.equals(regex1.right,regex2.right)
            }
        }else{
            return false;
        }
    }
    */

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

    simplify() {
        //console.log(`Current : ${this.toString()}`);
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
        else if (this.left.toString() === this.right.toString()) {
            return this.left.simplify();
        }

        //(a)* + a = (a)*
        else if (this.left.toString() === `(${this.right.toString()})*` && this.left.type === 'kleene') {
            return this.left.simplify();
        }

        // a + (a)* = (a)*
        else if (`(${this.left.toString()})*` === this.right.toString() && this.right.type === 'kleene') {
            return this.right.simplify();
        }

        //Nothing else worked
        else {
            return this.left.simplify().disjun(this.right.simplify());

        }
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
        else if ((this.left.toString() === this.right.toString())
            && (this.left.type === 'kleene' && this.right.type === 'kleene')) {
            return this.left.simplify();
        }

        //a(a)* = (a)*
        else if (this.right.type === 'kleene') {
            if (`(${this.left.toString()})*` === this.right.toString()) {
                return this.right.simplify();
            }
        }

        //(a)*a = (a)*
        else if (this.left.type === 'kleene') {
            if (this.left.toString() === `(${this.right.toString()})*`) {
                return this.left.simplify();
            }
        }

        //Nothing else worked
        else {
            return this.left.simplify().concat(this.right.simplify());
        }
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

        //nothing else worked
        else {
            return this.left.simplify().kleene();
        }
    }

    isEmptySet() {
        return ((this.type === 'base') && (this.value === '∅'));

    }
    isEpsilon() {
        return ((this.type === 'base') && (this.value === 'ɛ'));
    }
}


