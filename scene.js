class Scene {
    constructor(width, height, sceneOffset) {
        this.width = width;
        this.height = height;
        this.sceneOffset = sceneOffset; // Initial scene offset
    }

    draw(ctx) {
        // Draw the background with offset
        ctx.fillStyle = "#1818181"; // Background color
        ctx.fillRect(0, 0, this.width, this.height);
        // ctx.translate(-this.sceneOffset , 0); // Apply scene offset
    }

    updateOffset(playerX, canvasWidth) {
        const centerOfScreen = canvasWidth / 2;
        this.sceneOffset = playerX - centerOfScreen;
    }
}