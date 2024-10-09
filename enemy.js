class Enemy {
    constructor(enemies) {
        this.enemies = enemies;
        this.acceleration = 0.4;
        this.enemyImage = new  Image();
        this.enemyImage.src = "https://th.bing.com/th/id/R.030ac7d2634e8316a77e1f333c1b4350?rik=u%2bGxTAIC4pfTgg&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fghost-clipart-transparent%2fghost-clipart-transparent-23.png&ehk=2%2bxDJtRi3mSIQMoSWaf9Q5IOAJijVgVOPGVOQyWxoVc%3d&risl=&pid=ImgRaw&r=0"
        
    }

    draw(ctx, sceneOffset) {
        ctx.fillStyle = "red";
        for (let enemy of this.enemies) {
            // ctx.fillRect(enemy.x - sceneOffset, enemy.y, enemy.width, enemy.height);
            ctx.drawImage(this.enemyImage , enemy.x - sceneOffset , enemy.y ,enemy.width, enemy.height)
        }
    }

    // Update position of enemies based on platforms or road
    update(platforms, roadY) {
        // First enemy stays on the ground
        this.enemies[0].y = roadY - this.enemies[0].height;

        // Second enemy is placed on the first platform
        const platform = platforms[0];
        this.enemies[1].y = platform.y - this.enemies[1].height;
    }

    move() {
        for (let enemy of this.enemies) {
            // Update speed
            if (enemy.speed < enemy.maxSpeed) {
                enemy.speed += this.acceleration;
            }

            // Move enemy
            if (enemy.movingDirection) {
                enemy.x += enemy.speed;
            } else {
                enemy.x -= enemy.speed;
            }

            // Update traveled distance
            enemy.traveledDistance += enemy.speed;

            // Reverse direction when distance limit is reached
            if (enemy.traveledDistance >= enemy.distanceLimit) {
                enemy.movingDirection = !enemy.movingDirection; // Change direction
                enemy.traveledDistance = 0; // Reset distance counter
            }
        }
    }
}
