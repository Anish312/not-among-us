class Road {
    constructor(width, y, thickness = 20, dashLength = 20, dashGap = 15) {
        this.width = width;
        this.y = y;
        this.thickness = thickness;
        this.dashLength = dashLength; // Length of the dash
        this.dashGap = dashGap; // Gap between dashes
    }

    draw(ctx, sceneOffset) {
        // Draw road background
        ctx.fillStyle = "gray";
        ctx.fillRect(0, this.y, this.width, this.thickness);

        // Adding road markings (white dashed line in the center)
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.setLineDash([this.dashLength, this.dashGap]);

        // Start drawing dashed lines relative to sceneOffset
        const totalDashLength = this.dashLength + this.dashGap;
        const startX = -(sceneOffset % totalDashLength); // Offset dashes based on scene movement

        ctx.beginPath();

        // MoveTo should start at the correct position based on sceneOffset
        ctx.moveTo(startX, this.y + this.thickness / 2);

        // Draw dashed lines across the width of the canvas
        ctx.lineTo(this.width, this.y + this.thickness / 2);
        ctx.stroke();

        // Reset line dash
        ctx.setLineDash([]);
    }
}