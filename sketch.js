// Prepare empty array to store dots
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

let grid;
let cols;
let rows;

// Amount of circles in one direction
let g = 6;
// Circle diameter
let d = 32;

let region = []; // the collection of "on" states.

function setup() {
    createCanvas(450, 450);
    cols = g;
    rows = g;
    grid = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Calculate center position for circle within each grid cell
            let cOffset = (width / g - d) / 2;
            let cx = i * (width / g) + d / 2 + cOffset;
            let cy = j * (height / g) + d / 2 + cOffset;

            // Give this dot a random integer between 1 and the amount of dots
            let randInt = floor(random(1, cols * rows));

            // Add each dot to grid array, passing its position, diameter, and a number
            grid[i][j] = new Dot(cx, cy, d, 0);
        }
    }
}

function draw() {
    background(0);

    // Loop through grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Show dot for this grid item
            grid[i][j].show();
        }
    }
}

function mousePressed() {
    // Loop through grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Check if this item in grid was clicked
            grid[i][j].checkIfClicked();
        }
    }

    // testing increasing the number of dots
    // console.log(mouseX < 10 && mouseY < 10)
    // if (mouseX < 10 && mouseY < 10) {
    //     g++;
    // }
    // console.log(g)
}

function calculateExitTimes() {
    // Loop through grid to find which dots are on
    // place the "on" dots into region
    regionList = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].on) {
                regionList.push(new State(i,j));
            }
        }
    }

    let region = new Region(regionList);
    // return the exit time values. This is a dictionary
    // with keys [i,j] and values numbers that are the
    // exit time for the dot (i,j)
    return exit_times(region)
}

function updateCalculations () {
    let times = calculateExitTimes();
    for (const [p,time] of times) {
        console.log(time);
        console.log(time.toFraction());
        grid[p[0]][p[1]].n = time.toFraction();
        grid[p[0]][p[1]].textContent = time.toFraction();
    }
}
