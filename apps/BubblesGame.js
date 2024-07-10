import { Randoms } from "../utils/randoms.js";
import Button from "../components/Button.js";
import { langController } from "../controllers/stateControllers.js";

export default function BubblesGame(totalBubbles = 4) {
    console.log("BubblesGame opened")

    const SCALE = 1.5;
    
    const container = document.createElement('div');
    container.id = "game";
    container.className = "game-container";

    const gameHeader = document.createElement('header');
    gameHeader.className = "game-header";
    container.appendChild(gameHeader);

    const gameState = document.createElement('h2');
    gameState.className = "game-state transparent";

    const catchedText = langController.createLabel('span', "bubbles");
    catchedText.classList.add('state-text');
    catchedText.textContent += ": ";

    const catchedDigit = document.createElement('span');
    catchedDigit.className = 'state-digit in-block';

    gameState.append(catchedText, catchedDigit);

    const gameTime = document.createElement('h3');
    gameTime.className = "game-time transparent";

    const timeText = langController.createLabel('span', "time");
    timeText.classList.add('state-text');
    timeText.textContent += ": ";

    const timeDigit = document.createElement('span');
    timeDigit.className = 'state-digit';

    gameTime.append(timeText, timeDigit);

    const gameActions = document.createElement('div');
    gameActions.className = "game-actions";

    const actionStart = Button("start", "candy transparent");
    actionStart.id = "game-start";
    gameActions.appendChild(actionStart);
    actionStart.addEventListener("click", loadGame);

    gameHeader.append(gameState, gameTime, gameActions);

    const canvas = document.createElement("canvas");
    canvas.className = "bubbles-game game-canvas";

    canvas.width = window.innerWidth * SCALE;
    canvas.height = window.innerHeight * SCALE; // - (HEADER_HEIGHT * SCALE);
    const canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    container.appendChild(canvas);

    container.onselectstart = () => false;

    setTimeout( () => {
        const HEADER_HEIGHT = container.previousElementSibling.clientHeight;
        gameHeader.style.height = `${HEADER_HEIGHT}px`;
        canvas.height = canvasHeight - (HEADER_HEIGHT * SCALE);
        canvasHeight = canvas.height;
    }, 0)

    const ctx = canvas.getContext("2d");

    const MIN_RADIUS = 40;
    const MAX_RADIUS = Math.floor(Math.sqrt(canvasWidth * canvasHeight) / 15);
    const SPEED = 8;

    let BUBBLES = [];
    let HUNTER = {};

    let bubblesCountdown = totalBubbles;
    let bubblesCounter = 0;
    let gainer = 0;
    let timer = totalBubbles * 100;
    let timerIntervalID;

    let winOrLooseKey = "game_win";

    drawPoster("BubbleS", 150);

    class Shape {
        constructor(x, y, velX, velY) {
            this.x = x;
            this.y = y;
            this.velX = velX;
            this.velY = velY;
        }
    }

    class Ball extends Shape {
        border = 2;
        exist = true;
        constructor(x, y, velX, velY, color, radius) {
            super(x, y, velX, velY);
            this.color = color;
            this.radius = radius
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgb(${this.color})`;
            // ctx.strokeStyle = `rgb(${this.color})`;
            // ctx.lineWidth = this.border;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI);
            // ctx.arc(this.x - (this.radius / 3), this.y - (this.radius / 4), this.radius / 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        update() {
            if (this.velX === 0) { this.velX = 1 }
            if (this.velY === 0) { this.velY = 1 }
            if ((this.x + this.radius) >= canvasWidth) this.velX = -(this.velX);
            if ((this.y + this.radius) >= canvasHeight) this.velY = -(this.velY);
            if ((this.x - this.radius) <= 0) {
                if (this.x < 0) { this.x = this.radius + 1 }
                this.velX = -(this.velX)
            }
            if ((this.y - this.radius) <= 0) {
                if (this.y < 0) { this.y = this.radius + 1 }
                this.velY = -(this.velY);
            }
            this.x += this.velX;
            this.y += this.velY;
        }
        collisionDetect() {
            for (let ball of BUBBLES) {
                if ((this !== ball) && ball.exist) {
                    const dx = this.x - ball.x;
                    const dy = this.y - ball.y;
                    const sumOfRadiuses = this.radius + ball.radius;
                    const distance = Math.hypot(dx, dy);

                    if (distance <= sumOfRadiuses) {
                        let diff = Math.ceil(sumOfRadiuses - distance);
                        this.x < ball.x ? this.x -= diff : ball.x -= diff;
                        let ballVelX = ball.velX;
                        let ballVelY = ball.velY;
                        let thisVelX = this.velX;
                        let thisVelY = this.velY;
                        this.velX = ballVelX;
                        this.velY = ballVelY;
                        ball.velX = thisVelX;
                        ball.velY = thisVelY
                    }
                }
            }
        }
    }

    class HunterBall extends Ball {
        border = 8;
        ballsIterator = 0;
        pressed = false;
        constructor(x, y, velX, velY, color, radius) {
            super(...arguments);

            window.addEventListener("keydown", (e) => {
                this.pressed = true;
                switch (e.key) {
                    case "a":
                        this.x -= this.velX;
                        break;
                    case "d":
                        this.x += this.velX;
                        break;
                    case "w":
                        this.y -= this.velY;
                        break;
                    case "s":
                        this.y += this.velY;
                        break;
                }
            });
            const pointOnCanvas = (e) => this.pointToCursor(e);

            canvas.addEventListener("mousedown", (ev) => {
                this.pressed = true;
                this.pointToCursor(ev);
                canvas.addEventListener("mousemove", pointOnCanvas)
            });
            canvas.addEventListener("mouseup", () => {
                canvas.removeEventListener("mousemove", pointOnCanvas);
            })
            canvas.addEventListener("touchstart", (ev) => {
                ev.preventDefault();
                this.pressed = true;
                this.pointToCursor(ev);
                canvas.addEventListener("touchmove", pointOnCanvas)
            });
            canvas.addEventListener("touchend", () => {
                canvas.removeEventListener("touchmove", pointOnCanvas);
            })
        }

        pointToCursor(event) {
            const canvasRect = canvas.getBoundingClientRect();
            let pointX = 0;
            let pointY = 0;
            if (event.touches) {
                pointX = event.touches[0].clientX;
                pointY = event.touches[0].clientY;
            } else {
                pointX = event.clientX;
                pointY = event.clientY;
            }
            this.x = (canvasWidth / canvasRect.width) * (pointX - canvasRect.x);
            this.y = (canvasHeight / canvasRect.height) * (pointY - canvasRect.y);
        }

        // @Override
        draw() {
            ctx.beginPath();
            ctx.strokeStyle = `rgb(${this.color})`;
            ctx.lineWidth = this.border;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke()
        }
        // @Override
        update() {
            if ((this.x + this.radius) >= canvasWidth) this.x = canvasWidth - this.radius - this.border;
            if ((this.y + this.radius) >= canvasHeight) this.y = canvasHeight - this.radius - this.border;
            if ((this.x - this.radius) <= 0) this.x = this.radius + this.border;
            if ((this.y - this.radius) <= 0) this.y = this.radius + this.border;
        }
        // @Override
        collisionDetect() {
            if (this.pressed) {
                for (const ball of BUBBLES) {
                    if (ball.exist && (ball.radius <= this.radius)) {
                        const dx = this.x - ball.x;
                        const dy = this.y - ball.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < this.radius) {
                            this.ballsIterator++;
                            bubblesCountdown--;
                            bubblesCounter++;
                            if (this.ballsIterator < BUBBLES.length) {
                                this.color = BUBBLES[this.ballsIterator].color;
                                this.radius = BUBBLES[this.ballsIterator].radius
                            }
                            ball.exist = false;
                            catchedDigit.classList.add("catched");
                            catchedDigit.textContent = bubblesCounter;
                            setTimeout(() => {
                                catchedDigit.classList.remove("catched");
                            }, 500)
                        }
                    }
                }
            }
        }
    }

    // R_E_T_U_R_N //
    return container; //
    // R_E_T_U_R_N //

    function drawPoster(str, delay) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const center = canvasHeight / 2;
        const letterSize = Math.round(canvasWidth / (str.length + 2));
        let begin = letterSize;
        let count = 0;
        let bC = str.length * 2;

        let idIntervalDraw = setInterval(() => {
            if (bC <= 1) {
                clearInterval(idIntervalDraw);
                actionStart.classList.remove("transparent");
            }
            ctx.font = `bold ${letterSize}px monospace`;

            let r = Randoms.getRange(55, 255);
            let g = Randoms.getRange(55, 255);
            let b = Randoms.getRange(55, 255);

            let x = Randoms.getRange(MAX_RADIUS, canvasWidth - MAX_RADIUS);
            let y = Randoms.getRange(MAX_RADIUS, canvasHeight - MAX_RADIUS);
            let rd = Randoms.getRange(MIN_RADIUS, MAX_RADIUS);

            if (count < str.length) {
                // ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(str.charAt(count), begin, center);
                begin += letterSize;
                count++
            }
            ctx.beginPath();
            ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
            // ctx.lineWidth = 2;
            // ctx.strokeStyle = "rgba(225,255,255,0.5)";
            ctx.arc(x, y, rd, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.beginPath();
            ctx.arc(x, y, rd, Math.PI, 2 * Math.PI);
            // ctx.arc(x - (rd / 3), y - (rd / 4), rd / 3, 0, 2 * Math.PI);
            ctx.fill();
            bC--
        }, delay)
    }

    function loadGame() {
        this.removeEventListener('click', loadGame);
        gameState.classList.replace('transparent', 'loading');
        BUBBLES = [];
        while (BUBBLES.length < bubblesCountdown) {
            const currentRadius = Randoms.getRange(MIN_RADIUS, MAX_RADIUS);
            const ball = new Ball(
                Randoms.getRange(currentRadius, canvasWidth - currentRadius),
                Randoms.getRange(currentRadius, canvasHeight - currentRadius),
                Randoms.getRange(0 - SPEED, SPEED),
                Randoms.getRange(0 - SPEED, SPEED),
                Randoms.getRGB(),
                currentRadius
            );
            BUBBLES.push(ball)
        }
        BUBBLES.sort((a, b) => a.radius - b.radius)

        HUNTER = new HunterBall(canvasWidth / 2, canvasHeight - BUBBLES[0].radius, 64, 64, BUBBLES[0].color, BUBBLES[0].radius);

        setTimeout(() => {
            gameState.classList.replace('loading', 'on-game');
            gameTime.classList.remove('transparent');
            gameActions.classList.add('no-display');
            catchedDigit.textContent = bubblesCounter;
            loop();
            timerIntervalID = setInterval( () => { if (timer <= 0) { clearInterval(timerIntervalID) } timer -= 10 }, 100);
        }, 1000);
    }

    function resetGameState() {
        clearInterval(timerIntervalID);
        bubblesCounter = 0;
        bubblesCountdown = totalBubbles + gainer;
        timer = bubblesCountdown * 100;
        gameTime.classList.add("transparent");
        catchedDigit.textContent = "";
        gameState.classList.replace('on-game', 'win');
        langController.changeLabel(catchedText, winOrLooseKey);
        
        let buttonTextKey;
        (winOrLooseKey === "game_win") ? buttonTextKey = "next_round" : buttonTextKey = "repeat";

        setTimeout(() => {
            for (const ball of BUBBLES) { ball.exist = true }
            HUNTER.ballsIterator = 0;
            HUNTER.radius = BUBBLES[0];
            gameState.classList.replace('win', 'transparent');
            gameActions.classList.remove('on-game');
            langController.changeLabel(catchedText, "bubbles");
            catchedText.textContent += ": ";
            drawPoster("BubbleS", 100);
            gameActions.classList.remove('no-display');
            langController.changeLabel(actionStart, buttonTextKey);
            actionStart.addEventListener("click", loadGame);
        }, 3000);
    }

    function loop() {
        const idAnimation = requestAnimationFrame(loop);
        const isCanvas = document.querySelector('.bubbles-game');
        if (!isCanvas) { cancelAnimationFrame(idAnimation) }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctx.fillStyle = "rgba(32, 36, 40, 0.5)";
        // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        if (bubblesCountdown < 1) {
            cancelAnimationFrame(idAnimation);
            gainer++;
            winOrLooseKey = "game_win";
            resetGameState();
        } else if (timer <= 0) {
            timeDigit.textContent = 0;
            cancelAnimationFrame(idAnimation);
            winOrLooseKey = "game_loose";
            resetGameState();
        } else {
            timeDigit.textContent = timer;
            for (const ball of BUBBLES) {
                if (ball.exist) {
                    ball.draw();
                    ball.update();
                    ball.collisionDetect()
                }
            }
            HUNTER.draw();
            HUNTER.update();
            HUNTER.collisionDetect()
        }
    }
}