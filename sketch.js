function setup() {
    // initial values
    cs = [600,800];
    dfrac = 2/3;
    vis = 5;
    topleft = [0,0];

    updateDisplayConstants();
    
    createCanvas(cs[0], cs[1]);
  
    slider = createSlider(1, 100, vis, 0);
    slider.size(400,40);  

    lattice = new Lattice();
}

function draw() {
    background(0);
    vis = slider.value();
    updateDisplayConstants();

    // display the lattice
    displayLattice(lattice);
}

function mousePressed() {
    // check if click is in canvas
    if ((0 < mouseX) && (mouseX < cs[0]) && (0 < mouseY) && (mouseY < cs[1])) {
        // first we find the grid square where the mouse click occured
        let col = Math.floor((mouseX-firstGridCoord[0])/grid_size);
        let row = Math.floor((mouseY-firstGridCoord[1])/grid_size);

        // find the centre coordinates
        let centreX = col*grid_size+firstGridCoord[0] + cs[0]/(2*vis);
        let centreY = row*grid_size+firstGridCoord[1] + cs[1]/(2*visY);

        // check if click is in circle
        if (dist(mouseX, mouseY, centreX, centreY) < dfrac*grid_size/2) {
            // find lattice coords
            let i = start_ij[0]+col;
            let j = start_ij[1]+row;
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

