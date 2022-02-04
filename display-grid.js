// functions for displaying the grid of dots

// constants that get initialised and defined by user
let cs; // canvas size, array [x,y]  
let dfrac; // float, this is the fraction of each unit diameter is
let vis; // float, the number of grid squares visible in a row (fractional) in a 100x100 box
let offset; // ammount coordinates should be offset.
let s; // the scale

// option for display in circle
let textOption = 'empty' // can be 'coord', 'frac' or 'empty'
let heatOption = false // display colour as heat map
let autocomputeOption = false; // autocompute on each click?

// constants that get calculated and updated
let grid_size; // =100/vis, size of each grid square
let gx; // whole number of dots to display to the right/left of the middle in a row
let gy; // whole number of dots to display to above/below the middle in a column
let midGrid; // array [i,j] that gives coordinates of the dot closest to the middle

function updateDisplayConstants () {
    grid_size = 100/vis;

    gx = Math.ceil(cs[0]/(2*grid_size))+1;
    gy = Math.ceil(cs[1]/(2*grid_size))+1;

    midGrid = [Math.round(-offset[0]/grid_size),Math.round(-offset[1]/grid_size)];
    
}

function latticeToCanvas () {
    // given x,y coords in the lattice return coords on canvas
    // arguments can be passed as x,y floats, or as a length two array
    let x;
    let y;
    if (arguments.length == 1) {
        [x,y] = arguments[0];
    } else if (arguments.length == 2) {
        x = arguments[0];
        y = arguments[1];
    }
    let cX =  x/s + offset[0]/s + cs[0]/2;
    let cY = -y/s - offset[1]/s + cs[1]/2;

    return [cX,cY];
}

function canvasToLattice () {
    // given x,y coords in the canvas return coords on the lattice
    // arguments can be passed as x,y floats, or as a length two array
    let x,y;
    if (arguments.length == 1) {
        [x,y] = arguments[0];
    } else if (arguments.length == 2) {
        x = arguments[0];
        y = arguments[1];
    }
    let lX =  s*x - offset[0] - s*cs[0]/2;
    let lY = -s*y - offset[1] + s*cs[1]/2;

    return [lX,lY];
}

function displayLattice (lattice) {
    // displays a lattice.

    rowRange = [midGrid[1]-Math.floor(s*(gy)),
                midGrid[1]+Math.ceil(s*(gy))
               ];
    colRange = [midGrid[0]-Math.floor(s*(gx)),
                midGrid[0]+Math.ceil(s*(gx))
               ];
    
    for (let row = rowRange[0]; row < rowRange[1]; row++) {
        for (let col = colRange[0]; col < colRange[1]; col++) {
            let p = [col,row];

            let x = col*grid_size; // lattice coords
            let y = row*grid_size;

            let [cx,cy] = latticeToCanvas(x,y); 

            let colour = color(255);

            let textContent = ""
            if (textOption == "coord") {
                textContent = p;
            }
            
            
            if (lattice.in_region(p)) {
                switch (heatOption) {
                case true:
                    if (lattice.in_computed(p)) {
                        colour = lattice.get_colour(p);
                    } else {
                        colour = color(150);
                    }
                    break;
                case false:
                    colour = color(255,0,200);
                    break;
                }
                
                if (textOption == 'frac' && lattice.in_computed(p)) {
                    textContent = lattice.get_time(p).toFraction();
                }
            }
            
            noStroke();
            fill(colour);
            circle(cx, cy, grid_size*dfrac/s);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(24)
            scale(1/s);
            text(textContent, s*cx, s*cy);
            scale(s);
        }
    }
}

