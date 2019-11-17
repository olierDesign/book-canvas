var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    // 扭曲函数选项
    linearRadio = document.getElementById('linearRadio'),
    easeInRadio = document.getElementById('easeInRadio'),
    easeOutRadio = document.getElementById('easeOutRadio'),
    easeInOutRadio = document.getElementById('easeInOutRadio'),

    // 运动按钮
    animateButton = document.getElementById('animateButton'),

    // 跑步精灵图
    spritesheet = new Image(),
    // 跑步精灵图：每一步的图片位置
    runnerCells = [
        {left: 0, top: 0, width: 90, height: 123},
        {left: 90, top: 0, width: 90, height: 123},
        {left: 180, top: 0, width: 90, height: 123},
        {left: 270, top: 0, width: 90, height: 123},
        {left: 360, top: 0, width: 90, height: 123},
    ],

    interval,
    
    SPRITE_LEFT = canvas.width - runnerCells[0].width,          // 精灵的x轴
    SPRITE_TOP = 10,                                            // 精灵的y轴

    PAGEFLIP_INTERVAL = 100,                                    // 间隔 0.1s
    ANIMATION_DURATION = 3900,                                  // 总时长 3.9s

    // 动画计时器
    animationTimer = new AnimationTimer(ANIMATION_DURATION, AnimationTimer.makeLinear(1)),

    LEFT = 1.5,                                                 // 刻度的左端点 x轴
    RIGHT= canvas.width - runnerCells[0].width,                 // 刻度的右端点 x轴
    BASELINE = canvas.height - 9.5,                             // 刻度 y轴
    TICK_HEIGHT = 8.5,                                          // 刻线 长度
    WIDTH = RIGHT - LEFT,                                       // 刻度左点端到右端点的距离

    // 0.1s切换跑步精灵图
    runInPlace = {
        lastAdvance: 0,

        reset: function () {
            this.lastAdvance = 0;
        },

        execute: function() {
            var elapsed = animationTimer.getElapsedTime();

            if (this.lastAdvance === 0) {
                this.lastAdvance = elapsed;
            } else if (this.lastAdvance !== 0 && elapsed - this.lastAdvance > PAGEFLIP_INTERVAL) {
                sprite.painter.advance();
                this.lastAdvance = elapsed;
            }
        }
    },

    // 每一帧前进的距离
    moveRightToLeft = {
        lastMove: 0,

        reset: function () {
            this.lastMove = 0;
        },

        execute: function(sprite, context, time) {
            var elapsed = animationTimer.getElapsedTime(),
                advanceElapsed = elapsed - this.lastMove;

            if (this.lastMove === 0) {
                this.lastMove = elapsed;
            } else {
                sprite.left -= (advanceElapsed / 1000) * sprite.velocityX;
                this.lastMove = elapsed;
            }
        }
    },

    // 动画精灵
    sprite = new Sprite('runner', new SpriteSheetPainter(runnerCells), [moveRightToLeft, runInPlace]);

/**
 * 函数
 */

// 结束动画
function endAnimation() {
    animationTimer.stop();

    // 动画精灵重置回开始位置
    sprite.left = SPRITE_LEFT;
    // 跑步精灵图重置回第一帧
    sprite.painter.cellIndex = 0;
    // 动画计时器，计时重置为0
    animationTimer.reset();

    // 重置动画精灵的行为
    runInPlace.reset();
    moveRightToLeft.reset();
}

// 开始动画
function startAnimation() {
    animationTimer.start();
    window.requestNextAnimationFrame(animate);
}

// 刻度线
function drawAxis() {
    context.lineWidth = 0.5;
    context.strokeStyle = 'cornflowerblue';

    context.moveTo(LEFT, BASELINE);
    context.lineTo(RIGHT, BASELINE);
    context.stroke();

    for (var i = 0; i < WIDTH; i += WIDTH / 20) {
        context.beginPath();
        if (i % (WIDTH / 4) === 0) {
            context.moveTo(LEFT + i, BASELINE - TICK_HEIGHT);
            context.lineTo(LEFT + i, BASELINE + TICK_HEIGHT);
        } else {
            context.moveTo(LEFT + i, BASELINE - TICK_HEIGHT / 2);
            context.lineTo(LEFT + i, BASELINE + TICK_HEIGHT / 2);
        }
        context.stroke();
    }

    context.beginPath();
    context.moveTo(RIGHT, BASELINE - TICK_HEIGHT);
    context.lineTo(RIGHT, BASELINE + TICK_HEIGHT);
    context.stroke();
}

// 真实时间线
function drawTimeline() {
    var realElapsed = animationTimer.getRealElapsedTime(),
        realPercent = realElapsed / ANIMATION_DURATION;

    context.lineWidth = 0.5;
    context.strokeStyle = 'rgba(0, 0, 255, 0.5)';

    context.beginPath();
    context.moveTo(WIDTH - realPercent * WIDTH, 0);
    context.lineTo(WIDTH - realPercent * WIDTH, canvas.height);
    context.stroke();
}

/**
 * 事件处理函数
 */
animateButton.onclick = function(e) {
    // 重置动画
    endAnimation();

    // 开始动画
    startAnimation();
}
linearRadio.onchange = function(e) {
    animationTimer.timeWarp = AnimationTimer.makeLinear(1);
}
easeInRadio.onchange = function(e) {
    animationTimer.timeWarp = AnimationTimer.makeEaseIn(1);
}
easeOutRadio.onchange = function(e) {
    animationTimer.timeWarp = AnimationTimer.makeEaseOut(1);
}
easeInOutRadio.onchange = function(e) {
    animationTimer.timeWarp = AnimationTimer.makeEaseInOut();
}

/**
 * 动画循环
 */
function animate(time) {
    if (animationTimer.isRunning()) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        sprite.update(context, time);
        sprite.paint(context);

        drawTimeline();
        drawAxis();

        if (animationTimer.isOver()) {
            // 重置动画（但由于没有重新执行 paint，所以动画精灵不会回到最初的位置）
            endAnimation();
        }

        window.requestNextAnimationFrame(animate);
    }
}

/**
 * 初始化
 */
spritesheet.src = './running.png';

animateButton.value = 'Animate';

sprite.left = SPRITE_LEFT;      // 精灵x坐标
sprite.top = SPRITE_TOP;        // 精灵y坐标
sprite.velocityX = 100;         // 精灵水平方向的速度，单位: 像素/秒

drawAxis();                     // 刻度线

spritesheet.onload = function() {
    sprite.paint(context);
}