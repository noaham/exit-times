class Dot {
    constructor(x, y, d, n) {
        this.x = x;
        this.y = y;
        this.diam = d;
        this.n = n;
        this.textContent = "";
        this.col = color(255);
        this.on = false;
    }

    show() {
        noStroke();
        fill(this.col);
        circle(this.x, this.y, this.diam);
        fill(0);
        textSize(this.diam * 0.5);
        textAlign(CENTER, CENTER);
        text(this.textContent, this.x, this.y);
    }

    checkIfClicked() {
        let distance = dist(mouseX, mouseY, this.x, this.y);
        // If distance between mouse and circle is less than radius...
        if (distance < this.diam / 2) {
            // ...Then mouse is in circle...
            // ...Therefore check if already 'on' or not
            if (this.on) {
                this.col = color(255);
                this.textContent = "";
                this.on = false;
            } else {
                this.col = color(255, 0, 200);
                fill(255, 10, 0);
                this.textContent = this.n;
                this.on = true;
            }
            updateCalculations();
        }
    }
}
