class Camera {
    constructor(canvasWidth, canvasHeight, target) {
        this.x = 0; // Camera's x position
        this.y = 0; // Camera's y position
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.target = target; // The object to follow (usually the player)
    }

    update() {
        this.x = this.target.x - this.width / 2 + this.target.sizeX / 2;
        this.y = this.target.y - this.height / 2 + this.target.sizeY / 2;

  
    }
}