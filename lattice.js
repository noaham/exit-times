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


// This class sets up the mathematical aspects of an infinte lattice
// with a selected region.

class Lattice {
    constructor() {
        // always initialised empty
        this.region = [];
        this.times = [];
    }

    in_region(p) {
        // return true if p is in the selected region
        return inArray(this.region,p);
    }
    
    add(p) {
        // add a point p = [i,j] (ignore if already in region)
        if (!(this.in_region(p))) {
            this.region.push(p);
            this.update()
        }
    }

    remove(p) {
        // remove a point p = [i,j] (do nothing if not in region)
        if (this.in_region(p)) {
            const index = indexInArray(this.region,p);
            this.region.splice(index, 1);
            this.update()
        }
    }

    change_region(A) {
        // completely change region to A
        this.region = A;
        this.update();
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
        console.log(this.pMatrix());
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
}

function odd_floor (n) {
    // computes the largest odd number smaller than n
    return 2*Math.floor((n - 1)/2) + 1
}

function odd_ceil (n) {
    // computes the smallest odd number larger than n
    return 2*Math.ceil((n - 1)/2) + 1
}

function firstGrid (vis,cs) {
    // the top left coordinate of the first grid square
    let g = odd_ceil(vis,cs);
    let grid_size = cs/vis;
    let overhang = (cs-grid_size*(g-2))/2;
    let start_coord = overhang - grid_size;
    return start_coord;
}

function firstCentre (vis,cs) {
    // given a number of grid squares visible (vis), calculate the
    // coordinate (fcenre,fcentre) that is the centre of the first
    // grid square.
    let g = odd_ceil(vis,cs);
    let grid_size = cs/vis;
    let overhang = (cs-grid_size*(g-2))/2;
    let start_coord = overhang - grid_size;
    let fcentre = (start_coord+overhang)/2;
    return fcentre
}

function displayLattice (lattice,
                         vis,
                         dfrac,
                         cs,
                        ) {
    // displays a lattice.
    //     lattice: a lattice object
    //     vis: the number of grid squares in the viewer
    //     dfrac: ratio of circle diameter to grid square size
    //     cs: the canvas size

    // the size of each grid square
    let grid_size = cs/vis;
    // g-2 is the number of full dots on screen
    let g = odd_ceil(vis);

    // we also calculate the coordinates of the centre of the first dot
    let fcentre = firstCentre(vis,cs);
    let maxij = (g-1)/2;
    
    for (let row = 0; row < g; row++) {
        for (let col = 0; col < g; col++) {
            let p = [row-maxij,-col+maxij];

            let x = fcentre + row*grid_size;
            let y = fcentre + col*grid_size;

            let colour = color(255);
            let textContent = "";
            
            if (lattice.in_region(p)) {
                colour = color(255,0,200);
                textContent = lattice.get_time(p).toFraction();
            }
            
            noStroke();
            fill(colour);
            circle(x, y, grid_size*dfrac);
            fill(0);
            textAlign(CENTER, CENTER);
            text(textContent, x, y);
        }
    }
}
