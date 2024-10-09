class Platform {
    constructor(platforms) {
        this.platforms = platforms;
    }

    draw(ctx, sceneOffset) {
        ctx.fillStyle = "green";
        for (let platform of this.platforms) {
            ctx.fillRect(platform.x - sceneOffset, platform.y, platform.width, platform.height);
        }
    }
}