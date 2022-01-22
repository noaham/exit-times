class State {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    up () {
        return new State(this.x,this.y+1)
    }
    
    down () {
        return new State(this.x,this.y-1)
    }
    
    left () {
        return new State(this.x-1,this.y)
    }
    
    right () {
        return new State(this.x+1,this.y)
    }
    
    neighbours () {
        return [this.up(), this.down(), this.left(), this.right()]
    }
    
    is_neigh (other) {
        for (const state of this.neighbours()) {
            if (other.is_eq(state)) {
                return true
            }
        }
        return false
    }
    
    is_eq (other) {
        if ((this.x == other.x) && (this.y == other.y)) {
            return true
        } else {
            return false
        }
    }
}

function remDupStates (A) {
    let newA = []
    for (const state of A) {
        var already_contains = false;
        for (const other of newA) {
            if (state.is_eq(other)) {
                already_contains = true
            }
        }
        if (! already_contains) {
            newA.push(state)
        }
    }
    return newA
}

class Region {
    constructor(A) {
        // A is an array of States (possibly empty)
        this.states = remDupStates(A)
    }
    
    contains (other) {
        for (const state of this.states) {
            if (state.is_eq(other)) {
                return true
            }
        }
        return false
    }
    
    index (other) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].is_eq(other)) {
                return i
            }
        }
    }
    
    add (state) {
        if (! this.contains(state)) {
            this.states.push(state)
        }
    }
    
    rem (state) {
        if (this.contains(state)) {
            this.states.splice(this.index(state),1)
        }
    }
    
    Pmatrix () {
        let P = [];
        for (let i = 0; i < this.states.length; i++) {
            let row = [];
            for (let j = 0; j < this.states.length; j++) {
                if (this.states[i].is_neigh(this.states[j])) {
                    row[j] = 1/4;
                } else {
                    row[j] = 0;
                }
            }
            P[i] = row;
        }
        return math.matrix(P);
    }
    
    Laplacian () {
        return math.subtract(this.Pmatrix(),math.identity(this.states.length))
    }
}

function exit_times (region) {
    let L = region.Laplacian();
    let c = [];
    for (let i = 0; i < region.states.length; i++) {
        c[i] = -1;
    }
    let e =  math.multiply(math.inv(L),c);
    let times = {};
    for (const state of region.states) {
        let state_index = region.index(state);
        times[[state.x,state.y]] = e.get([state_index]);
    }
    return times;
}
