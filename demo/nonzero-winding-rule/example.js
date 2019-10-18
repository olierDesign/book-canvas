var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

function drowTwoArcs() {
    context.beginPath();
    context.arc(300, 190, 150, 0, 2 * Math.PI, false);
    context.arc(300, 190, 100, 0, 2 * Math.PI, true);

    context.fill();

    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.stroke();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    context.shadowOffsetX = 12;
    context.shadowOffsetY = 12;
    context.shadowBlur = 15;

    drowTwoArcs();
}

context.fillStyle = 'rgba(100, 140, 230, 0.5)';
context.strokeStyle = context.fillStyle;
draw();