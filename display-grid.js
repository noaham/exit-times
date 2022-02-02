// functions for displaying the grid of dots

// constants that get initialised and defined by user
let cs; // canvas size, array [x,y]  
let dfrac; // float, this is the fraction of each unit diameter is
let vis; // float, the number of grid squares visible in a row (fractional)
let topleft; // coordinates of the top left.

// option for display in circle
let textOption = 'empty' // can be 'coord', 'frac' or 'empty'
let heatOption = false // display colour as heat map

// constants that get calculated and updated
let grid_size; // =cs/vis, size of each grid square
let visY; // number of grid squares visible vertically
let gx; // odd_ceil(vis), whole number of dots to display in a row (some not visible)
let gy; // whole number of dots to display in a col
let overhang; // array [x,y], how much of the first grid square is on the canvas
let firstGridCoord; // array [x,y], coords of top left of top left grid square
let firstCentreCoord; // array [x,y], coords of top left centre
let start_ij; // array [x,y], lattice coords of top left dot (eg [-(gx-1)/2,(gy-1)/2]) when unshifted)

function odd_floor (n) {
    // computes the largest odd number smaller than n
    return 2*Math.floor((n - 1)/2) + 1
}

function odd_ceil (n) {
    // computes the smallest odd number larger than n
    return 2*Math.ceil((n - 1)/2) + 1
}

function updateDisplayConstants () {
    grid_size = cs[0]/vis;
    visY = cs[1]/grid_size;
    gx = odd_ceil(vis);
    gy = odd_ceil(visY);
    overhang = [(cs[0]-grid_size*(gx-2))/2,(cs[1]-grid_size*(gy-2))/2];
    firstGridCoord = [overhang[0]-grid_size,overhang[1]-grid_size];
    firstCentreCoord = [(firstGridCoord[0]+overhang[0])/2,(firstGridCoord[1]+overhang[1])/2];
    start_ij = [-(gx-1)/2,(gy-1)/2];
}

function displayLattice (lattice) {
    // displays a lattice.
    
    for (let row = 0; row < gy; row++) {
        for (let col = 0; col < gx; col++) {
            let p = [start_ij[0]+col,start_ij[1]-row];

            let x = firstCentreCoord[0] + col*grid_size;
            let y = firstCentreCoord[1] + row*grid_size;

            let colour = color(255);

            let textContent = ""
            if (textOption == "coord") {
                textContent = [start_ij[0]+col,start_ij[1]-row];
            }
            
            
            if (lattice.in_region(p)) {
                switch (heatOption) {
                case true:
                    colour = lattice.get_colour(p);
                    break;
                case false:
                    colour = color(255,0,200);
                    break;
                }
                
                if (textOption == 'frac') {
                    textContent = lattice.get_time(p).toFraction();
                }
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
