class Button {
    constructor({
        x = 0,
        y = 0,
        width = 70,
        height = 45,
        buttonColor = '#20afd6',
        text = 'default text',
        textColor = '#ffffff',
        clickCallback = (e) => {
            console.log(e)
        }
    }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.buttonColor = buttonColor;
        this.text = text;
        this.textColor = textColor;        
        this.clickCallback = clickCallback;

        // subscribe to mouse click event
        this.clickedEvent = mouseClickedEvent;
        this.clickedEvent.subscribe((e) => {            
            if (this.isInBoundaries(e.mouseX, e.mouseY))
                this.clickCallback(e);
        });
    }

    isInBoundaries(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }

    draw() {
        rectMode(CORNER);
        strokeWeight(2);
        stroke('#000000');
        fill(this.buttonColor);
        rect(this.x, this.y, this.width, this.height, 5);

        noStroke();
        fill(this.textColor);
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y, this.width, this.height);
    }
}