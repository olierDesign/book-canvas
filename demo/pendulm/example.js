var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    elapsedTime = undefined,                            // 持续时间

    PIVOT_Y = 20,                                       // 钟摆固定点-Y坐标
    PIVOT_RADIUS = 7,                                   // 钟摆固定点-半径
    WEIGHT_RADIUS = 25,                                 // 下摆-半径
    INITIAL_ANGLE = Math.PI / 5,                        // 初始角度
    ROD_LENGTH_IN_PIXELS = 300,                         // 摆杆长度

    // 钟摆精灵
    pendulumPainter = {
        PIVOT_FILL_STYLE: 'rgba(0, 0, 0, 0.2)',
        WEIGHT_SHADOW_COLOR: 'rgb(0, 0, 0)',
        PIVOT_SHADOW_COLOR: 'rgb(255, 255, 0)',
        STROKE_COLOR: 'rgb(100, 100, 195)',

        paint: function (pendulum, context) {
            this.drawPivot(pendulum);
            this.drawRod(pendulum);
            this.drawWeight(pendulum, context);
        },

        drawWeight: function (pendulum, context) {
            context.save();

            context.beginPath();
            context.arc(pendulum.weightX, pendulum.weightY, pendulum.weightRadius, 0, 2 * Math.PI, false);
            context.clip();
            context.shadowColor = this.WEIGHT_SHADOW_COLOR;
            context.shadowOffsetX = -4;
            context.shadowOffsetY = -4;
            context.shadowBlur = 8;
            context.lineWidth = 2;
            context.strokeStyle = this.STROKE_COLOR;
            context.stroke();

            context.beginPath();
            context.arc(pendulum.weightX, pendulum.weightY, pendulum.weightRadius / 2, 0, Math.PI * 2, false);
            context.clip();
            context.shadowColor = this.PIVOT_SHADOW_COLOR;
            context.shadowOffsetX = -4;
            context.shadowOffsetY = -4;
            context.shadowBlur = 8;
            context.stroke();

            context.restore();
        },

        drawPivot: function(pendulum) {
            context.save();
            
            context.beginPath();
            context.shadowColor = undefined;
            context.fillStyle = 'white';
            context.arc(pendulum.x + pendulum.pivotRadius, pendulum.y, pendulum.pivotRadius / 2, 0, Math.PI, false);
            context.fill();
            context.stroke();

            context.beginPath();
            context.fillStyle = this.PIVOT_FILL_STYLE;
            context.arc(pendulum.x + pendulum.pivotRadius, pendulum.y, pendulum.pivotRadius, 0, Math.PI * 2, false);
            context.fill();
            context.stroke();
            context.restore();
        },

        drawRod: function (pendulum) {
            context.beginPath();

            context.moveTo(
                pendulum.x + pendulum.pivotRadius + pendulum.pivotRadius * Math.sin(pendulum.angle),
                pendulum.y + pendulum.pivotRadius * Math.cos(pendulum.angle)
            );

            context.lineTo(pendulum.weightX - pendulum.weightRadius * Math.sin(pendulum.angle), pendulum.weightY - pendulum.weightRadius * Math.cos(pendulum.angle));

            context.stroke();
        }
    },

    swing = {
        GRAVITY_FORCE: 32,
        ROD_LENGTH: 0.8,

        execute: function(pendulum, context, time) {
            pendulum.angle = pendulum.initialAngle * Math.cos(Math.sqrt(this.GRAVITY_FORCE / this.ROD_LENGTH) * elapsedTime);

            pendulum.weightX = pendulum.x + Math.sin(pendulum.angle) * pendulum.rodLength;

            pendulum.weightY = pendulum.y + Math.cos(pendulum.angle) * pendulum.rodLength;
        }
    },

    pendulum = new Sprite('pendulum', pendulumPainter, [swing]);

// 动画循环
function animate(time) {
    elapsedTime = (time - startTime) / 1000;
    context.clearRect(0, 0, canvas.width, canvas.height);
    pendulum.update(context, time);
    pendulum.paint(context);
    window.requestNextAnimationFrame(animate);
}

// 初始化
pendulum.x = canvas.width / 2;
pendulum.y = PIVOT_Y;
pendulum.weightRadius = WEIGHT_RADIUS;
pendulum.pivotRadius = PIVOT_RADIUS;
pendulum.initialAngle = INITIAL_ANGLE;
pendulum.angle = INITIAL_ANGLE;
pendulum.rodLength = ROD_LENGTH_IN_PIXELS;

context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
context.shadowColor = 'rgba(0, 0, 0, 0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;
context.stroke();

startTime = +new Date();
animate(startTime);