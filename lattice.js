// Some functions to help with array equality checking

function arrayEq (A,B) {
    if (A.length == B.length) {
        for (let i = 0; i < A.length; i++) {
            if (A[i] != B[i]) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

function inArray(A,p) {
    for (const q of A) {
        if (arrayEq(p,q)) {
            return true;
        }
    }
    return false;
}

function indexInArray(A,p) {
    if (inArray(A,p)) {
        for (let i = 0; i < A.length; i++) {
            if (arrayEq(p,A[i])) {
                return i;
            }
        }
    } else {
        return -1;
    }
}

class ArrayMap {
    constructor() {
        this.keys = [];
        this.values = [];
    }

    set(key,val) {
        let index = indexInArray(this.keys,key);
        if (index > -1) {
            this.vals[index] = val;
        } else {
            this.keys.push(key);
            this.vals.push(val);
        }
    }

    get(key) {
        let index = indexInArray(this.keys,key);
        if (index > -1) {
            return this.vals[index];
        } else {
            throw new UserException('Not a valid key');
        }
    }
}

// functions to compute heatmap colours
function heatMapColorforValue(value){
    // value must be between zero and one
    // thanks: https://stackoverflow.com/a/27263918
    var h = Math.floor((1.0 - value) * 240)
    return "hsl(" + h + ", 100%, 50%)";
}

function timesToColourMap(t, times) {
    let maxt = Math.max.apply(Math, times)+1;
    let mint = Math.min.apply(Math, times)-1;
    let h = (t-mint)/(maxt-mint);
    return heatMapColorforValue(h);

}


// This class sets up the mathematical aspects of an infinte lattice
// with a selected region.

class Lattice {
    constructor() {
        // always initialised empty
        this.region = [];
        this.times = [];
        this.colours = [];
        this.computedPoints = [];
    }

    in_region(p) {
        // return true if p is in the selected region
        return inArray(this.region,p);
    }

    in_computed(p) {
        // return true if p is in the computed region
        return inArray(this.computedPoints,p);
    }
    
    add(p) {
        // add a point p = [i,j] (ignore if already in region)
        if (!(this.in_region(p))) {
            this.region.push(p);
            if (autocomputeOption) {
                this.update();
            }
        }
    }

    remove(p) {
        // remove a point p = [i,j] (do nothing if not in region)
        if (this.in_region(p)) {
            const index = indexInArray(this.region,p);
            this.region.splice(index, 1);
            if (autocomputeOption) {
                this.update();
            }
        }
    }

    change_region(A) {
        // completely change region to A
        this.region = A;
        if (autocomputeOption) {
            this.update();
        }
    }
    
    north(p) {
        // return the point immediately north of p
        return [p[0],p[1]+1];
    }

    south(p) {
        // return the point immediately south of p
        return [p[0],p[1]-1];
    }

    east(p) {
        // return the point immediately east of p
        return [p[0]+1,p[1]];
    }

    west(p) {
        // return the point immediately west of p
        return [p[0]-1,p[1]];
    }

    neighbours(p) {
        // return all the neighours of a point p
        return [this.north(p), this.south(p), this.east(p), this.west(p)];
    }

    neighbours_in_region(p) {
        // return the neighbours of p that are in the selected region
        let A = this.neighbours(p);
        let N = [];
        for (const q of A) {
            if (this.in_region(q)) {
                N.push(q);
            }
        }
        return N;
    }

    update() {
        // update the exit times
        this.times = this.exit_times();
        if (heatOption == true) {
            this.compute_colours();
        }
        this.region_update();
    }

    region_update () {
        this.computedPoints = [...this.region];
    }

    pMatrix() {
        // return the matrix of transition probabilities, for the selected region
        let P = [];
        for (let i = 0; i < this.region.length; i++) {
            let row = [];
            for (let j = 0; j < this.region.length; j++) {
                let iNeighs = this.neighbours_in_region(this.region[i]);
                // if region[j] is a neighbour of region[i]
                if (inArray(iNeighs,this.region[j])) {
                    row[j] = math.fraction('1/4');
                } else {
                    row[j] = math.fraction('0');
                }
            }
            P[i] = row;
        }
        return math.matrix(P);
    }

    laplacian () {
        // laplacian operator for the selected region
        if (this.region.length == 0) {
            return math.matrix([]);
        }
        return math.subtract(this.pMatrix(),math.identity(this.region.length));
    }

    exit_times() {
        // calculate the exit times for each point in the region
        if (this.region.length == 0) {
            return new Map();
        }
        let L = this.laplacian();

        let c = [];
        for (let i = 0; i < this.region.length; i++) {
            c[i] = -1;
        }
        let e =  math.multiply(math.inv(L),c);
        let times = [];
        for (const p of this.region) {
            let p_index = indexInArray(this.region,p);
            times[p_index] = e.get([p_index]);
        }
        return times;
    }

    get_time(p) {
        let index = indexInArray(this.region,p);
        if (index > -1) {
            return this.times[index];
        } else {
            return 0;
        }
    }

    compute_colours() {
        // calculate a map of colours, one for each point in region
        for (let i = 0; i < this.times.length; i++) {
            this.colours[i] = timesToColourMap(this.times[i],this.times)
        }
    }

    get_colour(p) {
        if (this.colours.length != this.computedPoints.length) {
            this.update();
        }
        let index = indexInArray(this.computedPoints,p);
        if (index > -1) {
            return this.colours[index];
        } else {
            return 0;
        }
    }
}

