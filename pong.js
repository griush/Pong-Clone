import {
    vec2,
    vec2Normailze,
    createQuadData,
    drawQuad,
    vec2Add,
    vec2Scale,
    randFloat,
    quadInQuad,
    pointInQuad,
    randChoose,
} from './modules/jsgl/src/jsgl.js'

const canvas = document.getElementById("main-canvas")
const ctx = canvas.getContext("2d")
const scoreText = document.getElementById("score")

// Game constants
let currently_playing = false

const canvasHalfWidth = canvas.width / 2
const canvasHalfHeight = canvas.height / 2

const midLineHalfWidth = 10
const midLineHeight = 20
const midLineSeparation = 20

const paddleBorderPadding = 20
const paddleHalfWidth = 10
const paddleHalfHeight = 50
const paddleSpeed = 500

const ballHalfSize = 10
let ballSpeed = 400

// Game vairiables
let lastFrameTime = 0.0

let leftPaddle = createQuadData(vec2(paddleBorderPadding + paddleHalfWidth, canvasHalfHeight), vec2(paddleHalfWidth, paddleHalfHeight), "#fff", ctx)
let rightPaddle = createQuadData(vec2(canvas.width - paddleBorderPadding - paddleHalfWidth, canvasHalfHeight), vec2(paddleHalfWidth, paddleHalfHeight), "#fff", ctx)

let ball = createQuadData(vec2(canvasHalfWidth, canvasHalfHeight), vec2(ballHalfSize, ballHalfSize), "#fff", ctx)
let ballSpeedVec = vec2Normailze(vec2(randChoose(-1, 1), randFloat(-1, 1)))

// Input
let wPressed = false
let sPressed = false
let upArrowPressed = false
let downArrowPressed = false

// Points
let leftPoints = 0
let rightPoints = 0

function drawMiddleLine() {
    const x = (canvasHalfWidth) - midLineHalfWidth
    let y = 0

    while (y < canvas.height - midLineHeight) {
        ctx.fillStyle = "#fff"
        ctx.fillRect(x, y, midLineHalfWidth * 2, midLineHeight)
        y += midLineHeight + midLineSeparation
    }
}

function updatePaddles(dt) {
    if (currently_playing) {
        // Left
        if (wPressed) {
            leftPaddle.pos.y -= paddleSpeed * dt
        }
        if (sPressed) {
            leftPaddle.pos.y += paddleSpeed * dt
        }

        if (upArrowPressed) {
            rightPaddle.pos.y -= paddleSpeed * dt
        }

        if (downArrowPressed) {
            rightPaddle.pos.y += paddleSpeed * dt
        }

        if (leftPaddle.pos.y < paddleHalfHeight + paddleBorderPadding) {
            leftPaddle.pos.y = paddleHalfHeight + paddleBorderPadding
        }

        if (leftPaddle.pos.y > canvas.height - paddleHalfHeight - paddleBorderPadding) {
            leftPaddle.pos.y = canvas.height - paddleHalfHeight - paddleBorderPadding
        }

        if (rightPaddle.pos.y < paddleHalfHeight + paddleBorderPadding) {
            rightPaddle.pos.y = paddleHalfHeight + paddleBorderPadding
        }

        if (rightPaddle.pos.y > canvas.height - paddleHalfHeight - paddleBorderPadding) {
            rightPaddle.pos.y = canvas.height - paddleHalfHeight - paddleBorderPadding
        }
    }
}

function drawPaddles() {
    // Left
    drawQuad(leftPaddle)
    drawQuad(rightPaddle)
}

function updateBall(dt) {
    if (currently_playing) {
        const speed = vec2Scale(ballSpeedVec, ballSpeed)
        ball.pos = vec2Add(ball.pos, vec2Scale(speed, dt))

        // Collision top/bottom
        if (ball.pos.y <= ballHalfSize) {
            ballSpeedVec.y = -ballSpeedVec.y
            ball.pos.y += 3
        } else if (ball.pos.y >= canvas.height - ballHalfSize) {
            ballSpeedVec.y = -ballSpeedVec.y
            ball.pos.y -= 3
        }

        // Paddle collision
        if (quadInQuad(ball, leftPaddle)) {
            ballSpeedVec.x = -ballSpeedVec.x
            ball.pos.x += 3
            ballSpeed += 5
        } else if (quadInQuad(ball, rightPaddle)) {
            ballSpeedVec.x = -ballSpeedVec.x
            ball.pos.x -= 3
            ballSpeed += 5
        }

        // Out of bounds (point scored)
        if (ball.pos.x < leftPaddle.pos.x + leftPaddle.size.x - 5/*some margin*/) {
            rightPoints += 1
            gameRestart()
        } else if (ball.pos.x > canvas.width - leftPaddle.pos.x - leftPaddle.size.x + 5) {
            leftPoints += 1
            gameRestart()
        }
    }
}

function drawBall() {
    drawQuad(ball)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawMiddleLine()
    drawPaddles()
    drawBall()
}

function gameRestart() {
    scoreText.innerText = leftPoints + "|" + rightPoints
    leftPaddle.pos.y = canvasHalfHeight
    rightPaddle.pos.y = canvasHalfHeight
    ballSpeedVec = vec2Normailze(vec2(randChoose(-1, 1), randFloat(-1, 1)))
    ball.pos = vec2(canvasHalfWidth, canvasHalfHeight)
    ballSpeed = 500
    currently_playing = false
}

function gameLoop() {
    const dt = (performance.now() - lastFrameTime) / 1000
    lastFrameTime = performance.now()

    updatePaddles(dt)
    updateBall(dt)
    draw()
    window.requestAnimationFrame(gameLoop)
}

function init() {
    document.addEventListener("keydown", (ev) => {
        if (ev.key === "w") {
            wPressed = true
        }

        if (ev.key === "s") {
            sPressed = true
        }

        if (ev.key === "ArrowUp") {
            ev.preventDefault()
            upArrowPressed = true
        }

        if (ev.key === "ArrowDown") {
            ev.preventDefault()
            downArrowPressed = true
        }
    })

    document.addEventListener("keyup", (ev) => {
        if (ev.key === "w") {
            wPressed = false
        }

        if (ev.key === "s") {
            sPressed = false
        }

        if (ev.key === "ArrowUp") {
            upArrowPressed = false
        }

        if (ev.key === "ArrowDown") {
            downArrowPressed = false
        }

        if (ev.key === " ") {
            currently_playing = true
        }
    })

    scoreText.innerText = leftPoints + "|" + rightPoints

    window.requestAnimationFrame(gameLoop)
}

window.onload = init