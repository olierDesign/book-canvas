var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    RADIUS = 75,
    ball = new Sprite('ball', {
        paint: function(sprite, context) {
            context.beginPath();
            context.arc(sprite.left + sprite.width / 2, sprite.top + sprite.height / 2, RADIUS, 0, 2 * Math.PI, false);
            context.clip();

            context.shadowColor = 'rgb(0, 0, 0)';
            context.shadowOffsetX = -4;
            context.shadowOffsetY = -4;
            context.shadowBlur = 8;

            context.lineWidth = 2;
            context.strokeStyle = 'rgb(100, 100, 195)';
            context.fillStyle = 'rgba(30, 144, 255, 0.15)';
            context.fill();
            context.stroke();
        }
    });

function drawGrid(color, stepX, stepY) {
    context.strokeStyle = color;
    context.lineWidth = 0.5;

    for (var i = stepX + 0.5; i < context.canvas.width; i += stepX) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (var i = stepY + 0.5; i < context.canvas.height; i += stepY) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}

drawGrid('lightgray', 10, 10);
ball.top = 160;
ball.left = 320;
ball.paint(context);