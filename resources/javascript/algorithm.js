let dfaToRegEx = (dfa) => {

    /* Returns an array of regular expressions from i to j*/
    let iToJ = (i, j) => {
        //Only loop through transitions starting at state i
        let currentState = dfa.states[i].on;

        //List of all found regex
        let regs = new Array();

        //Make sure path is not empty
        if (!(currentState === null || currentState === undefined)) {

            //Find transitions directing to state j
            Object.entries(currentState).forEach(([symbol, nextState]) => {
                if (String(nextState) === String(j)) {
                    regs.push(new RegularExp(String(symbol)));
                }
            });
        }


        //Case: i = j
        if (i === j) {
            regs.push(RegularExp.getEpsilon());
        }

        if (!regs.length) {
            regs.push(RegularExp.getEmptySet());
        }
        //Disjun all paths
        if (regs.length > 1) {
            result = regs[0];
            for (let x = 1; x < regs.length; x++) {
                result = result.disjun(regs[x]);
            }
            return result;
        } else {
            return regs[0];
        }
    }

    let numberOfStates = Object.keys(dfa.states).length;


    //contains regContainer[k][i][j]
    let regContainer = new Array(numberOfStates + 1);

    //Create 3d array
    for (let i = 0; i < numberOfStates + 1; i++) {
        regContainer[i] = new Array(numberOfStates);
        for (let j = 0; j < numberOfStates; j++) {
            regContainer[i][j] = new Array(numberOfStates);
            for (let pr = 0; pr < numberOfStates; pr++) {
                regContainer[i][j][pr] = {
                    toString: function () {
                        return "-"
                    }
                }
            }
        }
    }

    let setRegAt = (regex, k, i, j) => {
        regContainer[k][i - 1][j - 1] = regex;
    }

    let getRegAt = (k, i, j) => {
        return regContainer[k][i - 1][j - 1];
    }
    let printarray = () => {
        for (let k = 0; k <= numberOfStates; k++) {
            console.log(`--------------- k = ${k} --------------`)
            for (let i = 1; i <= numberOfStates; i++) {
                for (let j = 1; j <= numberOfStates; j++) {
                    console.log(`${k}${i}${j}:${getRegAt(k, i, j).toString()} : ${getRegAt(k, i, j).simplifyMax().toString()}`);
                }
            }
        }
    }

    for (let k = 0; k <= numberOfStates; k++) {
        for (let i = 1; i <= numberOfStates; i++) {
            for (let j = 1; j <= numberOfStates; j++) {
                //Base case
                if (k === 0) {
                    setRegAt(iToJ(i, j), k, i, j);
                } else {

                    //Known from before
                    let newReg = getRegAt(k - 1, i, j);
                    //New result
                    newReg = newReg.disjun(
                        getRegAt(k - 1, i, k).concat(getRegAt(k - 1, k, k).kleene()).concat(getRegAt(k - 1, k, j))
                    )
                    setRegAt(newReg.simplifyMax(), k, i, j);

                }
            }
        }
    }

    printarray();

    //TESTS

    let alphabet = RegularExp.createAlphabet(['a', 'b', 'ɛ', '∅']);

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

        notworking1: RegularExp.getEpsilon().disjun(
            RegularExp.getEpsilon().concat(RegularExp.getEpsilon().kleene().concat(RegularExp.getEpsilon()))),
        test2: RegularExp.getEmptySet().concat(RegularExp.getEmptySet())
    }

    let runTests = () => {
        Object.entries(tests).forEach(([key, value]) => {
            console.log(`${value.toString()} \t : ${value.simplify().toString()}`);

        });
    }

    console.log(RegularExp.equals(RegularExp.getEmptySet().disjun(alphabet.a),RegularExp.getEmptySet().disjun(alphabet.a)));
    console.log(RegularExp.equals(alphabet.a.concat(alphabet.ɛ),RegularExp.getEmptySet().disjun(alphabet.a)));

    return true;
}
