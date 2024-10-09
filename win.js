class Win {
    constructor(x, y, sizeX, sizeY) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.flag = new  Image();
        this.flag.src = "https://cdn.iconscout.com/icon/free/png-256/win-victory-flag-stick-fly-pride-18-32779.png"
    }

    draw(ctx, sceneOffset) {
        ctx.fillStyle = "white";
        ctx.drawImage(this.flag, this.x - sceneOffset, this.y, this.sizeX, this.sizeY);
        
    }
}