const canvas = document.getElementById("game");
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d");

const scene = new Scene(canvas.width, canvas.height, 0);
const road = new Road(100000, canvas.height - 20);

const platforms = [
    { x: 100, y: 400, width: 200, height: 10 },
    { x: 400, y: 250, width: 150, height: 10 },
    { x: 700, y: 250, width: 150, height: 10 },
    { x: 1000, y: 400, width: 200, height: 10 },
    { x: 1300, y: 250, width: 150, height: 10 },
    { x: 1600, y: 250, width: 150, height: 10 },
    { x: 2000, y: 400, width: 200, height: 10 },
    { x: 2300, y: 550, width: 150, height: 10 },
    { x: 2400, y: 350, width: 150, height: 10 },    
    { x: 3000, y: 550, width: 150, height: 10 },
    { x: 5600, y: 350, width: 150, height: 10 },
];
 const platformObj = new Platform(platforms);

const enemies = [
 { x: 800, y: 400, width: 40, height: 40, distanceLimit: 200, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 3 }, 
    { x: 900, y: 400, width: 40, height: 40,distanceLimit: 150, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 1 },
    { x:1400, y: 400, width: 40, height: 40, distanceLimit: 200, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 3 }, 
    { x: 2000, y: 350, width: 40, height: 40,distanceLimit: 150, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 1 }, 
   { x: 3000, y: 440, width: 40, height: 40, distanceLimit: 200, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 3 }, 
   { x: 1800, y: 400, width: 40, height: 40,distanceLimit: 150, traveledDistance: 0, step: 0, movingDirection: true, speed: 0, maxSpeed: 1 }, 
];

const obstacles = [
    { x: 200, y: 400, width: 40, height: 40}, 
    { x: 450, y: 400, width: 50, height: 30}, 
     { x: 2000, y: 410, width: 50, height: 70}, 

];

const obstacleObj  = new  Obstacles(obstacles)
const enemy = new Enemy(enemies);
const win = new Win(3600, 400, 90, 90);

const player = new Player(300, 0, 40, 40);

let gameRunning = true; // Variable to track if the game is running

function checkCollision(player, enemy) {
    return (
        player.x < enemy.x + enemy.width &&
        player.x + player.sizeX > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.sizeY > enemy.y
    );
}
let gameWon = false; // Variable to track if the player has won

function checkWin(player, win) {
    return (
        player.x > win.x +100
    );
}

function animate() {
    console.log(gameWon)
    if (!gameRunning || gameWon) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(gameWon ? "You Win!" : "Game Over", canvas.width / 2 - 100, canvas.height / 2);
        
        // Trigger the alert for the win or game over
        if (gameWon) {
            alert("Congratulations! You Win!");
        } else {
            alert("Game Over!");
        }

        return; // Stop the animation
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.save();

    scene.draw(ctx); // Optional background draw
    
    // Update and draw enemies
    enemy.update(platforms, road.y); // Update enemy positions based on platforms and road
    enemy.draw(ctx, scene.sceneOffset);
    enemy.move();

      // Update and draw enemies
    obstacleObj.update(platforms, road.y); // Update enemy positions based on platforms and road
    obstacleObj.draw(ctx, scene.sceneOffset);


    platformObj.draw(ctx, scene.sceneOffset); // Draw platforms
    road.draw(ctx, scene.sceneOffset); // Pass scene offset to road's draw method
    player.update(platforms , obstacles); // Update player with platforms
    player.draw(ctx); 
   win.draw(ctx ,scene.sceneOffset); 
    // Check for collision between player and each enemy
    for (let en of enemy.enemies) {
        if (checkCollision(player, en)) {
            gameRunning = false; // Stop the game on collision
            break;
        }
    }
    if (checkWin(player, win)) {
        gameWon = true; // Set the gameWon flag
    }

    ctx.restore();
    scene.updateOffset(player.x, canvas.width); // Update the scene offset based on player's position

    if (gameRunning) {
        requestAnimationFrame(animate); // Continue the game loop
    }
}

animate();