var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    fillStyleSelect = document.getElementById('fillStyleSelect'),
    drawRadio = document.getElementById('drawRadio'),
    eraserRadio = document.getElementById('eraserRadio'),
    eraserShapeSelect = document.getElementById('eraserShapeSelect'),
    eraserWidthSelect = document.getElementById('eraserWidthSelect'),

    ERASER_LINE_WIDTH = 1,
    ERASER_SHADOW_COLOR = 'rgb(0, 0, 0)',

    ERASER_SHADOW_STYLE = 'blue',
    ERASER_STROKE_STYLE = 'rgb(0, 0, 255)',
    ERASER_SHADOW_OFFSET = -5,
    ERASER_SHADOW_BLUR = 20,

    GRID_HORIZONTAL_SPACING = 10,
    GRID_VERTICAL_SPACING = 10,
    GRID_LINE_COLOR = 'lightblue',
    drawingSurfaceImageData,

    lastX,
    lastY,
    mousedown = {},
    rubberbandRect = {},
    dragging = false,
    guidewires = true;



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

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    }
}

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
}

// 橡皮筋
function updateRubberbandRectangle(loc) {
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
    rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

function drawRubberbandShape(loc) {
    var radius = Math.sqrt(rubberbandRect.width * rubberbandRect.width + rubberbandRect.height * rubberbandRect.height)

    context.beginPath();
    context.arc(mousedown.x, mousedown.y, radius, 0, 2 * Math.PI, false);
    context.stroke();
    context.fill();
}

function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc);
}

// 参考线
function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(context.canvas.width, y + 0.5);
    context.stroke();
}

function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, context.canvas.height);
    context.stroke();
}

function drawGuidewires(x, y) {
    context.save();
    context.strokeStyle = 'rgba(0, 0, 230, 0.4';
    context.lineWidth = 0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    context.restore();
}

function setDrawPathForEraser(loc) {
    var eraserWidth = parseFloat(eraserWidthSelect.value);

    context.beginPath();

    if (eraserShapeSelect.value === 'circle') {
        context.arc(loc.x, loc.y, eraserWidth / 2, 0, 2 * Math.PI, false);
    } else {
        context.rect(loc.x - eraserWidth / 2, loc.y - eraserWidth / 2, eraserWidth, eraserWidth);
    }

    context.clip();
}

function setErasePathForEraser() {
    var eraserWidth = parseFloat(eraserWidthSelect.value);

    context.beginPath();

    if (eraserShapeSelect.value === 'circle') {
        context.arc(lastX, lastY, eraserWidth / 2 + ERASER_LINE_WIDTH, 0, 2 * Math.PI, false);
    } else {
        context.rect(lastX - (eraserWidth / 2 + ERASER_LINE_WIDTH), lastY - (eraserWidth / 2 + ERASER_LINE_WIDTH), eraserWidth + ERASER_LINE_WIDTH * 2, eraserWidth + ERASER_LINE_WIDTH * 2);
    }

    context.clip();
}

function setEraserAttributes() {
    context.lineWidth = ERASER_LINE_WIDTH;
    context.shadowColor = ERASER_SHADOW_STYLE;
    context.shadowOffsetX = ERASER_SHADOW_OFFSET;
    context.shadowOffsetY = ERASER_SHADOW_OFFSET;
    context.shadowBlur = ERASER_SHADOW_BLUR;
    context.strokeStyle = ERASER_STROKE_STYLE;
}

function eraseLast() {
    context.save();

    setErasePathForEraser();
    drawGrid(GRID_LINE_COLOR, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);

    context.restore();
}

function drawEraser(loc) {
    context.save();

    setEraserAttributes();
    setDrawPathForEraser(loc);
    context.stroke();

    context.restore();
}

canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if (drawRadio.checked) {
        saveDrawingSurface();
    }

    mousedown.x = loc.x;
    mousedown.y = loc.y;

    lastY = loc.x;
    lastY = loc.y;

    dragging = true;
}

canvas.onmousemove = function(e) {
    var loc;
    if (dragging) {
        e.preventDefault();
        loc = windowToCanvas(e.clientX, e.clientY);

        if (drawRadio.checked) {
            restoreDrawingSurface();
            updateRubberband(loc);

            if (guidewires) {
                drawGuidewires(loc.x, loc.y);
            }
        } else {
            eraseLast();
            drawEraser(loc);
        }

        lastX = loc.x;
        lastY = loc.y;
    }
}

canvas.onmouseup = function(e) {
    loc = windowToCanvas(e.clientX, e.clientY);

    if (drawRadio.checked) {
        restoreDrawingSurface();
        updateRubberband(loc);
    }

    if (eraserRadio.checked) {
        eraseLast();
    }

    dragging = false;
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value;
}

fillStyleSelect.onchange = function(e) {
    context.fillStyle = fillStyleSelect.value;
}

context.strokeStyle = strokeStyleSelect.value;
context.fillStyle = fillStyleSelect.value;

drawGrid(GRID_LINE_COLOR, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);