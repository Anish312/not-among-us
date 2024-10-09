class Obstacles{
    constructor(obstacles) {
        this.obstacles = obstacles;
        this.obstaclesImage = new  Image();
        this.obstaclesImage.src = "https://img.itch.zone/aW1nLzEzMjEzNTkxLmdpZg==/original/Q1dWT1.gif"
        
    }

    draw(ctx, sceneOffset) {
        ctx.fillStyle = "brown";
        for (let obs of this.obstacles) {
            // ctx.fillRect(obs.x - sceneOffset, obs.y, obs.width, obs.height);
            ctx.drawImage(this.obstaclesImage , obs.x - sceneOffset , obs.y ,obs.width, obs.height)

        }
    }
    update(platforms, roadY) {
        // First enemy stays on the ground
        this.obstacles[0].y = roadY - this.obstacles[0].height;

        // Second enemy is placed on the first platform
        const platform = platforms[2];
        this.obstacles[1].y = platform.y - this.obstacles[1].height;
    }

    
}