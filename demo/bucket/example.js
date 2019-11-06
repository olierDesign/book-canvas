var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    scoreboard = document.getElementById('scoreboard'),
    launchAngleOutput = document.getElementById('launchAngleOutput'),
    launchVelocityOutput = document.getElementById('launchVelocityOutput'),

    elapsedTime = undefined,
    launchTime = undefined,

    score = 0,
    lastScore = 0,
    lastMouse = {left: 0, top: 0},

    threePointer = false,
    needInstructions = true,

    LAUNCHPAD_X = 50,
    LAUNCHPAD_Y = context.canvas.height - 50,
    LAUNCHPAD_WIDTH = 50,
    LAUNCHPAD_HEIGHT = 12,
    BALL_RADIUS = 8,
    ARENA_LENGTH_IN_METERS = 10,
    INITIAL_LAUNCH_ANGLE = Math.PI / 4,

    launchAngle = INITIAL_LAUNCH_ANGLE,
    pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS,

    // 发射板 -------------------------------------------------------------
    // 发射板 - 球——Painter
    launchPadPainter = {
        LAUNCHPAD_FILL_STYLE: 'rgb(100, 140, 230)',

        paint: function(ledge, context) {
            context.save();
            context.fillStyle = this.LAUNCHPAD_FILL_STYLE;
            context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y, LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT);
            context.restore();
        }
    },
    // 发射板 - 精灵
    launchPad = new Sprite('launchPad', launchPadPainter),

    // 球 -------------------------------------------------------------
    // 球 - Painter
    ballPainter = {
        BALL_FILL_STYLE: 'rgb(255, 255, 0)',
        BALL_STROKE_STYLE: 'rgb(0, 0, 0, 0.4)',

        paint: function(ball, context) {
            context.save();
            context.shadowColor = undefined;
            context.lineWidth = 2;
            context.fillStyle = this.BALL_FILL_STYLE;
            context.strokeStyle = this.BALL_STROKE_STYLE;

            context.beginPath();
            context.arc(ball.left, ball.top, ball.radius, 0, Math.PI * 2, false);
            
            context.clip();
            context.fill();
            context.stroke();
            context.restore();
        }
    },

    // 球 - behavior
    lob = {
        lastTime: 0,
        GRAVITY_FORCE: 9.81,

        applyGravity: function(elapsed) {
            ball.velocityY = (this.GRAVITY_FORCE * elapsed) - (launchVelocity * Math.sin(launchAngle));
        },

        updateBallPosition: function(updateDelta) {
            ball.left += ball.velocityX * (updateDelta) * pixelsPerMeter;
            ball.top += ball.velocityY * (updateDelta) * pixelsPerMeter;
        },

        checkForThreePointer: function() {
            if (ball.top < 0) {
                threePointer = true;
            }
        },

        checkBallBounds: function() {
            if (ball.top > canvas.height || ball.left > canvas.width) {
                reset();
            }
        },

        execute: function(ball, context, time) {
            var updateDelta,
                elapsedFlightTime;

            if (ballInFlight) {
                elapsedFrameTime = (time - this.lastTime) / 1000;
                elapsedFlightTime = (time - launchTime) / 1000;

                this.applyGravity(elapsedFlightTime);
                this.updateBallPosition(elapsedFrameTime);
                this.checkForThreePointer();
                this.checkBallBounds();
            }

            this.lastTime = time;
        }
    },
    // 球 - 精灵
    ball = new Sprite('ball', ballPainter, [lob]),
    ballInFlight = false,

    // 篮子 -------------------------------------------------------------
    // 篮子 - behavior
    catchBall = {
        ballInBucket: function() {
            return ball.left > bucket.left + bucket.width / 4 &&
                   ball.left < bucket.left + bucket.width &&
                   ball.top > bucket.top &&
                   ball.top < bucket.top + bucket.height / 3; 
        },

        adjustScore: function() {
            if (threePointer) {
                lastScore = 3;
            } else {
                lastScore = 2;
            }

            score += lastScore;

             scoreboard.innerText = score;
        },

        execute: function(bucket, context, time) {
            if (ballInFlight && this.ballInBucket()) {
                reset();
                this.adjustScore();
            }
        }
    },

    BUCKET_X = 668,
    BUCKET_Y = canvas.height - 100,
    BUCKET_Width= 100,
    BUCKET_Height= 89,
    bucketImage = new Image(),
    // 篮子 - 精灵    
    bucket = new Sprite('bucket', 
        {
            paint: function(sprite, context) {
                context.drawImage(bucketImage, 0, 0,bucketImage.width, bucketImage.height, BUCKET_X, BUCKET_Y, BUCKET_Width, BUCKET_Height);
            }
        },
        [catchBall]
    );

// 函数 -------------------------------------------------------------
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();

    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}
// 重置
function reset() {
    ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2;
    ball.top = LAUNCHPAD_Y - ball.height / 2;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ballInFlight = false;
    needInstructions = true;
    lastScore = 0;
}
// 球和鼠标连线
function drawGuidewire() {
    context.moveTo(ball.left, ball.top);
    context.lineTo(lastMouse.left, lastMouse.top);
    context.stroke();
}
// 提示信息
function showText(text) {
    var metrics;

    context.font = '42px Helvetica';
    metrics = context.measureText(text);

    context.save();
    context.shadowColor = undefined;
    context.strokeStyle = 'rgb(80, 120, 210)';
    context.fillStyle = 'rgba(100, 140, 230, 0.5)';

    context.fillText(text, canvas.width / 2 - metrics.width / 2, canvas.height / 2);
    context.strokeText(text, canvas.width / 2 - metrics.width / 2, canvas.height / 2);
    context.restore();
}
function updateBackgroundText() {
    if (lastScore == 3) {
        showText('Three pointer!');
    } else if (lastScore == 2) {
        showText('Nice shot!');
    } else if (needInstructions) {
        showText('Click to launch ball');
    }
}
// 重置分数
function resetScoreLater() {
    setTimeout(function() {
        lastScore = 0;
    }, 1000);
}
// 执行精灵们的 behaviors
function updateSprites(time) {
    bucket.update(context, time);
    launchPad.update(context, time);
    ball.update(context, time);
}
// 执行精灵们的 painters
function paintSprites() {
    launchPad.paint(context);
    ball.paint(context);
    bucket.paint(context);
}

// 事件处理 -------------------------------------------------------------
// 点击发射
canvas.onmousedown = function(e) {
    var rect;

    e.preventDefault();
    
    if (!ballInFlight) {
        ball.velocityX = launchVelocity * Math.cos(launchAngle);
        ball.velocityY = launchVelocity * Math.cos(launchAngle);

        ballInFlight = true;
        threePointer = false;
        launchTime = +new Date();
    }
};
// 鼠标移动 获取 速度和方向
canvas.onmousemove = function(e) {
    var rect;

    e.preventDefault();

    if (!ballInFlight) {
        loc = windowToCanvas(e.clientX, e.clientY);
        lastMouse.left = loc.x;
        lastMouse.top = loc.y;

        deltaX = Math.abs(lastMouse.left - ball.left);
        deltaY = Math.abs(lastMouse.top - ball.top);

        launchAngle = Math.atan(parseFloat(deltaY) / parseFloat(deltaX));

        launchVelocity = 4 * deltaY / Math.sin(launchAngle) / pixelsPerMeter;

        launchVelocityOutput.innerText = launchVelocity.toFixed(2);
        launchAngleOutput.innerText = (launchAngle * 180 / Math.PI).toFixed(2);
    }
}

// 动画 -------------------------------------------------------------
// animation loop
function animate(time) {
    elapsedTime = (time - launchTime) / 1000;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!ballInFlight) {
        drawGuidewire();
        updateBackgroundText();

        if (lastScore !== 0) {
            // Just scored
            resetScoreLater();
        }
    }

    updateSprites(time);
    paintSprites();

    window.requestNextAnimationFrame(animate);
}
// 初始化 -------------------------------------------------------------
// initialization
ball.width = BALL_RADIUS * 2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2;
ball.top = LAUNCHPAD_Y - ball.height / 2;
ball.radius = BALL_RADIUS;

lastMouse.left = ball.left;
lastMouse.top = ball.top;

context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
context.shadowColor = 'rgba(0, 0, 0, 0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;
context.stroke();

bucketImage.src='./image/bucket.png';
bucketImage.onload = function(e) {
    bucket.left = BUCKET_X;
    bucket.top = BUCKET_Y;
    bucket.width = BUCKET_Width;
    bucket.height = BUCKET_Height;
}

window.requestNextAnimationFrame(animate);