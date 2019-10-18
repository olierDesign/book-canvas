var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

function drawGrid(context, color, stepX, stepY) {
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

drawGrid(context, 'lightgray', 10, 10);