const keys = { // keys to listen to
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
};
document.addEventListener('keydown', keyEvent);
document.addEventListener('keyup', keyEvent);  
document.addEventListener("click",()=>requestAnimationFrame(mainLoop),{once:true});
var startTime;
var globalTime;
const mapItemCount = 10000;
const maxItemSize = 120; // in pixels
const minItemSize = 20; // in pixels
const maxQuadDepth = 5;
const playfieldSize = 16000; // in pixels
var id = 1;  // unique ids for map items
const mapItems = new Map();  // unique map items
const directions = {
    NONE: {idx: 0, vec: {x: 0, y: 0}},
    UP: {idx: 3, vec: {x: 0, y: -1}},
    RIGHT: {idx: 0, vec: {x: 1, y: 0}},
    DOWN: {idx: 1, vec: {x: 0, y: 1}},
    LEFT: {idx: 2, vec: {x: -1, y: 0}},
};
const ctx = canvas.getContext("2d");

function mainLoop(time) {
    if(!startTime) { startTime = time }
    globalTime = time - startTime;
    playfield.sizeCanvas();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    player.update();
    playfield.setView(player);  // current transform set to view
    
    playfield.drawVisible();
    player.draw();
    
    info.textContent = `Player: X:${player.x|0} Y${player.y|0}: , View Left:${playfield.left | 0} Top:${playfield.top | 0} , visibleItems: ${playfield.visibleItems.size} of ${mapItems.size}`;
    
    requestAnimationFrame(mainLoop);
}

function Quad(x, y, w, h, depth = maxQuadDepth) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    if (depth > 0) { this.divide(depth) }
    else { this.items = [] }
}
Quad.prototype = {
    divide(depth) {
        this.subQuads = [];
        this.subQuads.push(new Quad(this.x, this.y, this.w / 2, this.h / 2, depth - 1));
        this.subQuads.push(new Quad(this.x + this.w / 2, this.y, this.w / 2, this.h / 2, depth - 1));
        this.subQuads.push(new Quad(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, depth - 1));
        this.subQuads.push(new Quad(this.x, this.y + this.h / 2, this.w / 2, this.h / 2, depth - 1));       
    },
    isInView(pf) {  // pf is playfield
        return !(this.x > pf.left + pf.cWidth || this.x + this.w < pf.left || this.y > pf.top + pf.cHeight || this.y + this.h < pf.top);
    },
    addItem(item) {
        if (!(item.x > this.x + this.w || item.x + item.w < this.x || item.y > this.y + this.h || item.y + item.h < this.y)) {
            if (this.subQuads) {
                for (const quad of this.subQuads) { quad.addItem(item) }
            } else { this.items.push(item.id) }
        }
    },
    getVisibleItems(pf, itemMap, items = new Map()) {
        if (this.subQuads) {
            for (const quad of this.subQuads) {
                if (quad.isInView(pf)) { quad.getVisibleItems(pf, itemMap, items) }
            }
        } else {
            for (const id of this.items) { items.set(id, itemMap.get(id)) }
        }
        return items
    }   
}
// only one instance then define as object
const playfield = {
    width: playfieldSize,
    height: playfieldSize,
    view: [1,0,0,1,0,0],  // view as transformation matrix
    cWidth: 0,  // canvas size
    cHeight: 0, // canvas size
    top: 0,
    left: 0,
    sizeCanvas() {
        if(canvas.width !== innerWidth || canvas.height !== innerHeight) {
            this.cWidth = canvas.width = innerWidth;
            this.cHeight = canvas.height = innerHeight;         
        }
    },
    setView(player) {
        var left = player.x - this.cWidth / 2;
        var top = player.y - this.cHeight / 2;
        left = left < 0 ? 0 : left > this.width - this.cWidth ? this.width - this.cWidth : left;
        top = top < 0 ? 0 : top > this.height - this.cHeight ? this.height - this.cHeight : top;
        this.view[4] = -(this.left = left);
        this.view[5] = -(this.top = top);
        ctx.setTransform(...this.view);
        this.visibleItems.clear();
        this.quadMap.getVisibleItems(this, mapItems, this.visibleItems);
    },
    drawVisible() {
        for(const item of this.visibleItems.values()) { item.draw() }  
    },
    quadMap: new Quad(0, 0, playfieldSize, playfieldSize),
    visibleItems: new Map(),
}

function MapItem(x, y, w, h, col = "#ABC") {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = "#ABC";
    this.id = id++;
    mapItems.set(this.id,this);
    playfield.quadMap.addItem(this);
}
MapItem.prototype = {
    draw() {
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
addMapItems(mapItemCount)
function addMapItems(count) {
    while (count-- > 0) {
        const x = Math.random() * playfield.width;
        const y = Math.random() * playfield.height;
        const w = Math.random() * (maxItemSize - minItemSize) + minItemSize;
        const h = Math.random() * (maxItemSize - minItemSize) + minItemSize;
        const item = new MapItem(x,y,w,h);
    }
}

// only one instance then define as object
const player = {
    x: 1200,
    y: 1200,
    speed: 10,
    image: undefined,
    direction: undefined,
    draw() {
        ctx.fillStyle = "#F00";
        ctx.save();  // need to save and restore as I use rotate to change the current transform that 
                     // holds the current playfield view.
        const x = this.x;
        const y = this.y;
        ctx.transform(1,0,0,1,x,y);
        ctx.rotate(this.direction.idx / 2 * Math.PI);
        ctx.beginPath();
        ctx.lineTo(20, 0);
        ctx.lineTo(-10, 14);
        ctx.lineTo(-10, -14);
        ctx.fill();
        ctx.restore();
        
    },
    update() {
        var dir = directions.NONE;
        if (keys.ArrowUp) { dir = directions.UP }
        if (keys.ArrowDown) { dir = directions.DOWN }
        if (keys.ArrowLeft) { dir = directions.LEFT }
        if (keys.ArrowRight) { dir = directions.RIGHT }
        this.x += dir.vec.x * this.speed;
        this.y += dir.vec.y * this.speed;
        this.x = this.x < 0 ? 0 : this.x > playfield.width ? playfield.width : this.x;
        this.y = this.y < 0 ? 0 : this.y > playfield.height ? playfield.height : this.y;
        this.direction = dir;
        
    }
};


function keyEvent(e) {
    if (keys[e.code] !== undefined) {
        keys[e.code] = e.type === "keydown";
        e.preventDefault();
    }
}