let cs = 500; // canvas size  
let dfrac = 2/3; // this is the fraction of each unit diameter is
let vis;

function setup() {
    createCanvas(cs, cs);
  
    slider = createSlider(1, 100, 5, 0);
    slider.size(400,40);  

    lattice = new Lattice();
}

function draw() {
    background(0);
    vis = slider.value(); // num of visible dots

    // display the lattice
    displayLattice(lattice,vis,dfrac,cs);
}

function mousePressed() {
    // check if click is in canvas
    if ((0 < mouseX) && (mouseX < cs) && (0 < mouseY) && (mouseY < cs)) {
        // first we find the grid square where the mouse click occured
        let fgrid = firstGrid(vis,cs);
        let g = odd_ceil(vis);
        let grid_size = cs/vis;
        let col = Math.floor((mouseX-fgrid)/grid_size);
        let row = Math.floor((mouseY-fgrid)/grid_size);

        // find the centre coordinates
        let centreX = col*(cs/vis)+fgrid + cs/(2*vis);
        let centreY = row*(cs/vis)+fgrid + cs/(2*vis);
        
        // check if click is in circle
        if (dist(mouseX, mouseY, centreX, centreY) < dfrac*cs/(2*vis)) {
            // find lattice coords
            let i = col - (g-1)/2;
            let j = -row + (g-1)/2;
            let p = [i,j];

            // add or remove point from region
            if (lattice.in_region(p)) {
                lattice.remove(p);
            } else {
                lattice.add(p);
            }
        }
    }
}

