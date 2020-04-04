export default class Button {
    constructor({
        x = 0,
        y = 0,
        width = 70,
        height = 45,
        buttonColor = '#20afd6',
        text = 'default text',
        textColor = '#ffffff',
        mouseClickedEvent,
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

    draw(p5) {
        p5.rectMode(p5.CORNER);
        p5.strokeWeight(2);
        p5.stroke('#000000');
        p5.fill(this.buttonColor);
        p5.rect(this.x, this.y, this.width, this.height, 5);

        p5.noStroke();
        p5.fill(this.textColor);
        p5.textSize(15);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.text, this.x, this.y, this.width, this.height);
    }
}