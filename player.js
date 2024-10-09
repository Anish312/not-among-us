class Player {
    constructor(x, y, sizeX, sizeY, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.speed = 0;
        this.acceleration = 0.2;
        this.jumpVelocity = 0;
        this.jumpStrength = 13;
        this.gravity = 0.5;
        this.friction = 0.05;
        this.maxSpeed = maxSpeed;
        this.onGround = false;
        this.onPlatform = false;
        this.damaged = false;
        this.playerImageLeft = new Image();
        this.playerImageLeft.src = "https://www.imagenspng.com.br/wp-content/uploads/2020/10/among-us-blue-png-01.png";
        this.playerImageLoaded = false;
        this.playerImageRight = new Image();
        this.playerImageRight.src = "https://i0.wp.com/cdn.iconscout.com/icon/free/png-256/blue-among-us-3218506-2691064.png";
        this.activeImage = true
        // Wait for the image to load

        this.playerImageLeft.onload = () => {
            this.playerImageLoaded = true; // Set to true when the image has loaded
        };

        this.playerImageLeft.onerror = () => {
            console.error("Failed to load player image."); // Log an error if the image fails to load
        };
        this.controls = new Controls("KEYS");

    }

    jump() {
        if (this.controls.up && (this.onGround || this.onPlatform)) {
            this.jumpVelocity = -this.jumpStrength; // Jumping force
            this.onGround = false;
            this.onPlatform = false;
        }
    }
    applyGravity(platforms, obstacles) {
        this.onPlatform = false; // Reset platform state each frame
        this.onGround = false;   // Reset ground state
    
        // Apply gravity (falling)
        this.y += this.jumpVelocity;
        this.jumpVelocity += this.gravity;
    
        // Check if player is on any platform
        for (let platform of platforms) {
            if (
                this.x + this.sizeX > platform.x &&    // Player right side passes platform left side
                this.x < platform.x + platform.width && // Player left side passes platform right side
                this.y + this.sizeY >= platform.y &&    // Player is falling onto platform
                this.y + this.sizeY <= platform.y + this.jumpVelocity // Player is just landing
            ) {
                // Player lands on the platform
                this.y = platform.y - this.sizeX;  // Place player on top of platform
                this.jumpVelocity = 0;             // Stop falling
                this.onPlatform = true;            // Mark player as on platform
                break;                             // No need to check other platforms
            }
        }
    
        // If not on a platform, check if the player hits the road
        if (!this.onPlatform && this.y >= road.y - this.sizeY) {
            // Player lands on the road
            this.y = road.y - this.sizeY;
            this.jumpVelocity = 0; // Stop falling
            this.onGround = true;  // Mark player as on the ground
        }
    
        // Handle obstacle collisions (checking all sides)
        for (let obs of obstacles) {
            // Check if there's a collision
            if (
                this.x < obs.x + obs.width &&       // Player's left side is left of obstacle's right side
                this.x + this.sizeX > obs.x &&      // Player's right side is right of obstacle's left side
                this.y < obs.y + obs.height &&      // Player's top is above obstacle's bottom
                this.y + this.sizeY > obs.y         // Player's bottom is below obstacle's top
            ) {
                // Determine the minimum distance to resolve the collision in either direction
                const overlapLeft = this.x + this.sizeX - obs.x; // Overlap when colliding with left side of obstacle
                const overlapRight = obs.x + obs.width - this.x; // Overlap when colliding with right side of obstacle
                const overlapTop = this.y + this.sizeY - obs.y;  // Overlap when colliding with top of obstacle
                const overlapBottom = obs.y + obs.height - this.y; // Overlap when colliding with bottom of obstacle
    
                // Find the smallest overlap to determine the collision side
                const smallestOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
                if (smallestOverlap === overlapLeft) {
                    // Collision on the left
                    this.x = obs.x - this.sizeX; // Push player to the left of the obstacle
                } else if (smallestOverlap === overlapRight) {
                    // Collision on the right
                    this.x = obs.x + obs.width; // Push player to the right of the obstacle
                } else if (smallestOverlap === overlapTop) {
                    // Collision on the top
                    this.y = obs.y - this.sizeY; // Push player to the top of the obstacle
                    this.jumpVelocity = 0;       // Stop downward movement
                    this.onGround = true;        // Mark player as on ground
                } else if (smallestOverlap === overlapBottom) {
                    // Collision on the bottom
                    this.y = obs.y + obs.height; // Push player to the bottom of the obstacle
                    this.jumpVelocity = 0;       // Stop upward movement
                }
            }
        }
    }
    
    move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
            this.activeImage = false; // Facing right
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
            this.activeImage = true; // Facing left
        }

        this.speed *= (1 - this.friction);
        this.x += this.speed;
  

    }

    update(platforms , obstacles) {
        this.move();
        this.jump();
        this.applyGravity(platforms , obstacles);
    }

    draw(ctx) {
        if (this.playerImageLoaded) {
            if(!this.activeImage) {
                ctx.drawImage(this.playerImageLeft, this.x - scene.sceneOffset, this.y, this.sizeX, this.sizeY);
            }else {
                ctx.drawImage(this.playerImageRight, this.x - scene.sceneOffset, this.y, this.sizeX, this.sizeY);

            }

        } else {
            // Optionally, you can fill a rectangle or display a placeholder
            ctx.fillStyle = "blue"; // Fallback color
            ctx.fillRect(this.x - scene.sceneOffset, this.y, this.sizeX, this.sizeY); // Draw placeholder
        }
    }
}
