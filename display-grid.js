// functions for displaying the grid of dots

// constants that get initialised and defined by user
let cs; // canvas size, array [x,y]  
let dfrac; // float, this is the fraction of each unit diameter is
let vis; // float, the number of grid squares visible in a row (fractional)
let offset; // ammount coordinates should be offset.

// option for display in circle
let textOption = 'empty' // can be 'coord', 'frac' or 'empty'
let heatOption = false // display colour as heat map

// constants that get calculated and updated
let grid_size; // =cs/vis, size of each grid square
let visY; // number of grid squares visible vertically
let gx; // odd_ceil(vis), whole number of dots to display in a row (some not visible)
let gy; // whole number of dots to display in a col
let firstVisGrid; // array [i,j] lattice coords of first grid square visible

function odd_floor (n) {
    // computes the largest odd number smaller than n
    return 2*Math.floor((n - 1)/2) + 1
}

function odd_ceil (n) {
    // computes the smallest odd number strictly larger than n
    let ceil = 2*Math.ceil((n - 1)/2) + 1;
    if (ceil == n) {
        return n+2;
    }
    return ceil;
}

function offsetCoords(x,y) {
    // given coordinates x,y in canvas, return the offset coordinates
    return [x-offset[0],y-offset[1]];
}

let initShift;
function updateDisplayConstants () {
    grid_size = cs[0]/vis;
    visY = cs[1]/grid_size;
    gx = Math.ceil(vis)+1;
    gy = Math.ceil(visY)+1;
    firstCentreCoord = [Math.round(offset[0]/grid_size)*grid_size,
                      Math.round(offset[1]/grid_size)*grid_size
                     ];
    firstVisGrid = [Math.round(offset[0]/grid_size),
                    -Math.round(offset[1]/grid_size)
                   ];
}

function displayLattice (lattice) {
    // displays a lattice.
    translate(-offset[0],-offset[1]);
    
    for (let row = 0; row < gy; row++) {
        for (let col = 0; col < gx; col++) {
            let p = [firstVisGrid[0]+col,firstVisGrid[1]-row];

            let x = firstCentreCoord[0] + col*grid_size;
            let y = firstCentreCoord[1] + row*grid_size;

            let colour = color(255);

            let textContent = ""
            if (textOption == "coord") {
                textContent = p;
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
    translate(offset[0],offset[1]);
}

