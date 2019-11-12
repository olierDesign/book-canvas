var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
    CENTROID_FILL_STYLE = 'rgba(80, 190, 240, 0.6)',

    RING_INNER_RADIUS = 35,
    RING_OUTER_RADIUS = 55,

    ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    ANNOTATIONS_TEXT_SIZE = 12,

    TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
    TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

    TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(250, 250, 0, 0.6)',

    circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 150
    };

function drawGrid(color, stepX, stepY) {
    context.save();
    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.strokeStyle = color;
    context.fillStyle = '#fff';
    context.lineWidth = 0.5;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = stepX + 0.5; i < canvas.width; i += stepX) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }

    for(var i = stepY + 0.5; i < canvas.height; i += stepY) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.stroke();
    }

    context.restore();
}

function drawDial() {
    var loc = {
        x: circle.x,
        y: circle.y
    }

    drawCentroid();
    drawCentroidGuidewire(loc);
    drawRing();
    drawTickInnerCircle();
    drawTicks();
    drawAnnotations();
}

// 中心点
function drawCentroid() {
    context.beginPath();
    context.save();
    context.strokeStyle = CENTROID_STROKE_STYLE;
    context.fillStyle = CENTROID_FILL_STYLE;
    context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, 2 * Math.PI, false);
    context.stroke();
    context.fill();
    context.restore();
}

// 导线
function drawCentroidGuidewire(loc) {
    var angle = -Math.PI / 4,
        radius,
        endpt;

    radius = circle.radius + RING_OUTER_RADIUS;

    if (loc.x >= circle.x) {
        endpt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
        }
    } else {
        endpt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        }
    }

    context.save();

    context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
    context.fillStyle = GUIDEWIRE_FILL_STYLE;

    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(endpt.x, endpt.y);
    context.stroke();

    context.beginPath();
    context.strokeStyle = TICK_LONG_STROKE_STYLE;
    context.arc(endpt.x, endpt.y, 5, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.restore();
}

// 外圆（双层蓝色）
function drawRing() {
    
    drawRingOuterCircle();

    context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, 2 * Math.PI, false);

    context.fillStyle = 'rgba(100, 140, 230, 0.1';
    context.fill();
    context.stroke();
}
function drawRingOuterCircle() {
    context.shadowColor = 'rgba(0, 0, 0, 0,7)';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 6;
    context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius + RING_OUTER_RADIUS, 0, 2 *  Math.PI, true);
    context.stroke();
}

// 内圆（浅灰色）
function drawTickInnerCircle() {
    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS - TICK_WIDTH, 0, 2 * Math.PI, false);
    context.stroke();
    context.restore();
}

// 刻度线
function drawTicks() {
    var radius = circle.radius + RING_INNER_RADIUS,
        ANGLE_MAX = 2 * Math.PI,
        ANGLE_DELTA = Math.PI / 64,
        tickWidth;

    context.save();

    for(var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
        drawTick(angle, radius, cnt);
    }

    context.restore();
}
function drawTick(angle, radius, cnt) {
    var tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

    context.beginPath();
    context.moveTo(
        circle.x + Math.cos(angle) * (radius - tickWidth),
        circle.y + Math.sin(angle) * (radius - tickWidth)
    );
    context.lineTo(
        circle.x +  Math.cos(angle) * radius,
        circle.y +  Math.sin(angle) * radius
    );
    context.stroke();
}

// 数标
function drawAnnotations() {
    var radius = circle.radius + RING_INNER_RADIUS;

    context.save();
    context.fillStyle = ANNOTATIONS_FILL_STYLE;
    context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';

    for (var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        context.beginPath();
        context.fillText(
            (angle * 180 / Math.PI).toFixed(0),
            circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
            circle.y + Math.sin(angle) * (radius - TICK_WIDTH * 2)
        );
    }

    context.restore();
}

context.shadowColor = 'rgba(0, 0, 0, 0.4)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';

drawGrid('lightgray', 10, 10);
drawDial();