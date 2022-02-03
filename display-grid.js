// functions for displaying the grid of dots

// constants that get initialised and defined by user
let cs; // canvas size, array [x,y]  
let dfrac; // float, this is the fraction of each unit diameter is
let vis; // float, the number of grid squares visible in a row (fractional) in a 100x100 box
let offset; // ammount coordinates should be offset.
let s; // the scale

// option for display in circle
let textOption = 'coord' // can be 'coord', 'frac' or 'empty'
let heatOption = false // display colour as heat map

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

function tf() {
    translate(cs[0]/2,cs[1]/2);
    scale(1/s)
    
    applyMatrix(1,0,0,-1,0,0); // flip the y-coords
    translate(offset[0],offset[1]);
}

function inv_tf() {
    translate(-offset[0],-offset[1]);
    applyMatrix(1,0,0,-1,0,0); // flip the y-coords
    
    scale(s);
    translate(-cs[0]/2,-cs[1]/2);
}



function displayLattice (lattice) {
    tf();
    
    // displays a lattice.

    rowRange = [midGrid[1]-Math.floor(s*(gy)),midGrid[1]+Math.ceil(s*(gy))]
    colRange = [midGrid[0]-Math.floor(s*(gx)),midGrid[0]+Math.ceil(s*(gx))]
    
    for (let row = rowRange[0]; row < rowRange[1]; row++) {
        for (let col = colRange[0]; col < colRange[1]; col++) {
            let p = [col,row];

            let x = col*grid_size;
            let y = row*grid_size;

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
            
            translate(x,y);
            applyMatrix(1,0,0,-1,0,0); 
            text(textContent, 0, 0);
            applyMatrix(1,0,0,-1,0,0); 
            translate(-x,-y);
        }
    }
    inv_tf();
}

