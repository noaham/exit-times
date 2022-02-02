let pressedCoords;

function mouseInCanvas () {
    // returns true/false if mouse is in canvas
    return ((0 < mouseX) && (mouseX < cs[0]) && (0 < mouseY) && (mouseY < cs[1]));
}

function centreOffset () {
    offset = [-cs[0]/2,-cs[1]/2];
}

function setup() {
    // initial values
    cs = [980,620];
    dfrac = 9.5/10;
    vis = cs[0]/100;
    offset = [-cs[0]/2,-cs[1]/2];

    updateDisplayConstants();
    
    createCanvas(cs[0], cs[1]);
  
    slider = createSlider(1, 50, vis, 0);
    slider.size(400,40);

    checkbox = createCheckbox('Heatmap?', true);

    radioText = createRadio();
    radioText.option('empty', 'No text');
    radioText.option('coord', 'Coordinates');
    radioText.option('frac', 'Fractions');
    radioText.style('width', '30px');
    textAlign(CENTER);

    button = createButton('Centre');
    button.mousePressed(centreOffset);
    

    lattice = new Lattice();
}

function draw() {
    background(0);
    vis = slider.value();
    textOption = radioText.value()
    heatOption = checkbox.checked()

    if (mouseIsPressed && mouseInCanvas()) {
        offset = [offset[0] - movedX,offset[1] - movedY]
    }
    
    updateDisplayConstants();

    // display the lattice
    displayLattice(lattice);
}

function mousePressed() {
    if (mouseInCanvas()) {
    // save the coords where the mouse was pressed 
        pressedCoords = [mouseX,mouseY];
    }
}

function mouseReleased() {
    // check if click is in canvas
    if (mouseInCanvas()) {
        releaseCoords = [mouseX,mouseY];
        dragDistance = dist(pressedCoords[0],pressedCoords[1],releaseCoords[0],releaseCoords[1]);
        
        // check if mouse was clicked or draged
        if (dragDistance < 3) {
            // mouse was clicked (or very very short drag which we count as a click)
            
            // first we find the grid square where the mouse click occured
            let col = Math.round((mouseX+offset[0])/grid_size);
            let row = -Math.round((mouseY+offset[1])/grid_size);

            // find the centre coordinates
            let centreX = col*grid_size;
            let centreY = row*grid_size;
            console.log(centreX-offset[0],-centreY-offset[1]);

            // check if click is in circle
            if (dist(mouseX, mouseY, centreX-offset[0], -centreY-offset[1]) < dfrac*grid_size/2) {
                // find lattice coords
                let p = [col,row];

                // add or remove point from region
                if (lattice.in_region(p)) {
                    lattice.remove(p);
                } else {
                    lattice.add(p);
                }
            }
        } 
    }
}
