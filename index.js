//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;


//physics
let velocityX = 0
let velocityY = 0 //doodler jump speed
let initialVelocityY = -8 //starting velocity
let gravity = 0.4


//platforms

let platformArray = []
let platformWidth = 60
let platformHeight = 18
let platformImg 


let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth
    context = board.getContext("2d") // for drawing on the board

    //image load
    doodlerRightImg = new Image();
    doodlerRightImg.src = './assets/doodler-right.png'
    doodler.img = doodlerRightImg
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodlerWidth, doodlerHeight)
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = './assets/doodler-left.png'

    platformImg = new Image();
    platformImg.src = './assets/platform.png'

    velocityY = initialVelocityY

    placeplatforms()
    requestAnimationFrame(update)
    addEventListener('keydown', moveDoodler)

}

function update(){ //drawing
    requestAnimationFrame(update)
    context.clearRect(0,0, boardWidth,boardHeight)

    //doodler
    doodler.x += velocityX
    if (doodler.x > boardWidth){
        doodler.x = 0
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth
    }

    velocityY+= gravity
    doodler.y+= velocityY
    context.drawImage(doodler.img, doodler.x, doodler.y, doodlerWidth, doodlerHeight) // loop - we draw the doodler over and over
    
    
    //platforms
    for (let i = 0 ; i< platformArray.length; i++){
        let platform = platformArray[i]
        if (velocityY < 0 && doodler.y < boardHeight*3/4){ //if we are falling down and doodler is above that 3/4 height
            platform.y -= initialVelocityY //slide platform down
        } 
        if (detectCollision(doodler,platform) && velocityY >= 0){
            velocityY = initialVelocityY // jump of the platform
        }
        context.drawImage(platform.img, platform.x, platform.y, platformWidth, platformHeight)
    }
}

function moveDoodler(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") { 
        velocityX = 4;
        doodler.img = doodlerRightImg
    } else if (e.code === "ArrowLeft" || e.code === "KeyA"){
        velocityX = -4
        doodler.img = doodlerLeftImg
    }

}

function placeplatforms(){
    platformArray = []

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform)

    for (let i = 0; i < 6;i++){
        let randomX = Math.floor(Math.random()* boardWidth*3/4)
        let platform = {
            img : platformImg,
            x : randomX,
            y: boardHeight - 75*i - 150,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform)
        
    }
}

function newPlatform(){

    for (let i = 0; i < 6;i++){
        let randomX = Math.floor(Math.random()* boardWidth*3/4)
        let platform = {
            img : platformImg,
            x : randomX,
            y: -platformHeight,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform)
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}