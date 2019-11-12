var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    ARROW_MARGIN = 30,
    POINT_RADIUS = 7,
    points = [
        {
            x: canvas.width - ARROW_MARGIN,
            y: canvas.height - ARROW_MARGIN
        },
        {
            x: canvas.width - ARROW_MARGIN * 2,
            y: canvas.height - ARROW_MARGIN
        },
        {
            x: POINT_RADIUS,
            y: canvas.height / 2
        },
        {
            x: ARROW_MARGIN,
            y: canvas.height / 2 - ARROW_MARGIN
        },
        {
            x: canvas.width - ARROW_MARGIN,
            y: ARROW_MARGIN
        },
        {
            x: canvas.width - ARROW_MARGIN,
            y : ARROW_MARGIN * 2
        }
    ];
    
function drawPoint(x, y, strokeStyle, fillStyle) {
    context.beginPath();
    context.fillStyle = fillStyle,
    context.strokeStyle = strokeStyle;
    context.lineWidth = 0.5;
    context.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
}

// 标注点
function drawBezierPoints() {
    var i,
        strokeStyle,
        fillStyle;

    for (var i = 0; i < points.length; i++) {
        fillStyle = i % 2 === 0 ? 'white' : 'blue';
        strokeStyle = i % 2 === 0 ? 'blue' : 'white';
        drawPoint(points[i].x, points[i].y, strokeStyle, fillStyle);
    }
}

// 三角
function drawArrow() {
    context.strokeStyle = 'white';
    context.fillStyle = 'cornflowerblue';

    context.moveTo(canvas.width - ARROW_MARGIN, ARROW_MARGIN * 2);
    context.lineTo(canvas.width - ARROW_MARGIN, canvas.height - ARROW_MARGIN * 2);
    context.stroke();

    context.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y);
    context.stroke();

    context.lineTo(ARROW_MARGIN, canvas.height / 2 + ARROW_MARGIN);
    context.stroke();

    context.quadraticCurveTo(points[2].x, points[2].y, points[3].x, points[3].y);
    context.stroke();

    context.lineTo(canvas.width - ARROW_MARGIN * 2, ARROW_MARGIN);
    context.stroke();

    context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);
    context.fill();
    context.stroke();
}

context.clearRect(0, 0, canvas.width, canvas.height);
drawArrow();
drawBezierPoints();