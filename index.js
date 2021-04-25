const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

class SnakePart {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}


let speed = 7

// Dessin du serpent
let tileCount = 20
let tileSize = canvas.width / tileCount - 2
let headX = 10
let headY = 10

const snakeParts = []
let tailLength = 2
// Déplacement du serpent
let xVelocity = 0
let yVelocity = 0

// Pomme
let appleX = 5
let appleY = 5

let score = 0

const gumpSound = new Audio("gulp.mp3")

// * Boucle du jeu
function drawGame() {

    changeSnakePosition()
    let result = isGameOver()
    if (result) {
        return
    }

    clearScreen()

    checkAppleCollision()
    drawApple()
    drawSnake()

    drawScore()

    if(score > 2) {
        speed = 11
    }

    if(score > 5) {
        speed = 15
    }

    setTimeout(drawGame, 1000 / speed)
}

function isGameOver() {
    let gameOver = false

    if (yVelocity === 0 && xVelocity === 0) {
        return false
    }

    // - Murs
    if(headX < 0) {
        gameOver = true
    }
    else if (headX === tileCount) {
        gameOver = true
    }
    else if (headY < 0) {
        gameOver = true
    }
    else if (headY === tileCount) {
        gameOver = true
    }

    // - Corps du serpent
    for(let i=0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        if(part.x === headX && part.y === headY) {
            gameOver = true
            break
        }
    }

    if (gameOver) {
        ctx.fillStyle = "White"
        ctx.font = "50px Verdana"

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop("0", " magenta")
        gradient.addColorStop("0.5", "blue")
        gradient.addColorStop("1.0", "red")
        // -Remplir avec le linear gradient
        ctx.fillStyle = gradient

        ctx.fillText("Game Over !", canvas.width / 8, canvas.height / 2)
    }
    return gameOver
}

function drawScore() {
    ctx.fillStyle = "White"
    ctx.font = "14px Verdana"
    ctx.fillText('Score ' + score, canvas.width -70, 14)
}

function clearScreen() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawSnake() {

    ctx.fillStyle = 'green'
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    // * Mettre un objet à la fin de la list, après la tête
    snakeParts.push(new SnakePart(headX, headY))
    while (snakeParts.length > tailLength) {
        snakeParts.shift()
    }

    ctx.fillStyle = 'orange'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function drawApple() {
    ctx.fillStyle = "red"
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function changeSnakePosition() {
    headX = headX + xVelocity
    headY = headY + yVelocity
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount)
        appleY = Math.floor(Math.random() * tileCount)
        tailLength++
        score ++
        gulpSound.play()
    }
}

document.body.addEventListener('keydown', keyDown)

function keyDown(event) {
    // - Haut
    if (event.keyCode == 38) {
        if (yVelocity == 1)
            return
        yVelocity = -1
        xVelocity = 0
    }

    // - Bas
    if (event.keyCode == 40) {
        if (yVelocity == -1)
            return
        yVelocity = 1
        xVelocity = 0
    }

    // - Gauche
    if (event.keyCode == 37) {
        if (xVelocity == 1)
            return
        yVelocity = 0
        xVelocity = -1
    }

    // - Droite
    if (event.keyCode == 39) {
        if (xVelocity == -1)
            return
        yVelocity = 0
        xVelocity = 1
    }
}

drawGame()
