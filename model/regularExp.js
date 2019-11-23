module.exports = class RegularExp{
    constructor(value = null, base = true, type = "base", left = null, right = null){
        if(value != null){
            this.value = value;
        }
        this.base = base;
        this.type = type;
        this.left = left;
        this.right = right;
    }

    toString(){
        return this.value;
    }

    concat(regex2){
        return {
            type: 'concat',
            base: false,
            left: regex1,
            right: regex2,
            toString: function(){
                return this.left.toString() + this.right.toString();
            }
        }
    }

    static kleene(){
        return {
            type: 'kleene',
            base: false,
            value: regex,
            toString: function(){
                return '(' + regex.toString() + ')*';
            }
        }
    }

    static disjun(regex1, regex2){
        return {
            type: 'disjun',
            base: false,
            left: regex1,
            right: regex2,
            toString: function(){
                return regex1.toString() + "+" + regex2.toString();
            }
        }
    }
}

