let pressedCoords;
let mousePressedInCanvas = false; //records if the mouse was pressed in the canvas

function mouseInCanvas () {
    // returns true/false if mouse is in canvas
    return ((0 < mouseX) && (mouseX < cs[0]) && (0 < mouseY) && (mouseY < cs[1]));
}

function centreOffset () {
    offset = [0,0];
}

function setup() {
    // initial values
    cs = [980,620];
    dfrac = 9.5/10;
    vis = 1;
    s = 1;
    offset = [0,0];

    updateDisplayConstants();
    
    createCanvas(cs[0], cs[1]);
  
    slider = createSlider(0.25, 10, s, 0);
    slider.size(400,40);

    checkbox = createCheckbox('Heatmap?', true);

    radioText = createRadio();
    radioText.option('empty', 'No text');
    radioText.option('coord', 'Coordinates');
    radioText.option('frac', 'Fractions');
    radioText.style('width', '30px');
    textAlign(CENTER);
    radioText.selected(textOption);

    button = createButton('Centre');
    button.mousePressed(centreOffset);
    

    lattice = new Lattice();
}

function draw() {
    background(0);
    //s = slider.value();
    textOption = radioText.value()
    heatOption = checkbox.checked()

    if (mouseIsPressed && mouseInCanvas() && mousePressedInCanvas) {
        offset = [offset[0] + s*movedX,offset[1] - s*movedY]
    }
    
    updateDisplayConstants();
    
    // display the lattice
    displayLattice(lattice);
}

function mousePressed() {
    if (mouseInCanvas()) {
        mousePressedInCanvas = true;
        // save the coords where the mouse was pressed 
        pressedCoords = [mouseX,mouseY];
    }
}

function mouseReleased() {
    mousePressedInCanvas = false;

    // check if click is in canvas
    if (mouseInCanvas()) {
        releaseCoords = [mouseX,mouseY];
        dragDistance = dist(pressedCoords[0],pressedCoords[1],releaseCoords[0],releaseCoords[1]);

        // check if mouse was clicked or draged
        if (dragDistance < 3) {
            // mouse was clicked (or very very short drag which we count as a click)
            
            // first we find the grid square where the mouse click occured
            let col =  Math.round((s*(mouseX-cs[0]/2)-offset[0])/grid_size);
            let row =  Math.round((s*(-mouseY+cs[1]/2)-offset[1])/grid_size);

            // find the centre coordinates
            let centreX = (col*grid_size + offset[0])/s  + cs[0]/2 ;
            let centreY = -(row*grid_size + offset[1])/s + cs[1]/2;

            // check if click is in circle
            if (dist(mouseX, mouseY, centreX, centreY) < dfrac*grid_size/(2*s)) {
                //console.log('made it');
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

function mouseWheel (event) {
    if (mouseInCanvas) {
        s += 0.01*event.delta;
        dirVec = [mouseX-cs[0]/2,mouseY-cs[1]/2]
        //offset = [offset[0] + 0.01*s*dirVec[0],offset[1] - 0.01*s*dirVec[1]]
        if (s < 0.1) {
            s = 0.1;
        }
        if (s > 8) {
            s = 8;
        }
    }
}
