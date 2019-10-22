var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    eraseAllButton = document.getElementById('eraseAllButton'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    fillStyleSelect = document.getElementById('fillStyleSelect'),
    fillCheckbox = document.getElementById('fillCheckbox'),
    editCheckbox = document.getElementById('editCheckbox'),
    sidesSelect = document.getElementById('sidesSelect'),
    startAngleSelect = document.getElementById('startAngleSelect'),

    drawingSurfaceImageData,

    mousedown = {},
    rubberbandRect = {},

    dragging = false,
    draggingOffsetX,
    draggingOffsetY,

    sides = 8,
    startAngle = 0,

    guidewires = true,

    editing = false,
    polygons = [];

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

// 存储和恢复画面
function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
}

// 画一个多边形
var Point = function(x, y) {
    this.x = x;
    this.y = y;
}

var Polygon = function(centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.sides = sides;
    this.startAngle = startAngle;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.filled = filled;
}

Polygon.prototype = {
    getPoints: function() {
        var points = [],
            angle = this.startAngle || 0;
        
        for (var i = 0; i < this.sides; ++i) {
            points.push(new Point(
                this.x + this.radius * Math.cos(angle),
                this.y + this.radius * Math.sin(angle)
            ));

            angle += 2 * Math.PI / this.sides;
        }

        return points;
    },

    createPath: function(context) {
        var points = this.getPoints();
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < this.sides; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
    },
    stroke: function(context) {
        context.save();
        this.createPath(context);
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.restore();
    },
    fill: function(context) {
        context.save();
        this.createPath(context);
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    },
    move: function(x, y) {
        this.x = x;
        this.y = y;
    }
}

function drawPolygon(polygon) {
    context.beginPath();
    // polygon.createPath(context);
    polygon.stroke(context);

    if (fillCheckbox.checked) {
        polygon.fill(context);
    }
}

// 橡皮筋
function updateRubberbandRectangle(loc) {
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
    rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

function drawRubberbandShape() {
    var polygon = new Polygon(
        mousedown.x,
        mousedown.y,
        rubberbandRect.width,
        parseInt(sidesSelect.value),
        (Math.PI / 180) * parseInt(startAngleSelect.value),
        context.strokeStyle,
        context.fillStyle,
        fillCheckbox.checked
    );

    drawPolygon(polygon);

    if (!dragging) {
        polygons.push(polygon);
    }
}

function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape();
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

function drawPolygons() {
    polygons.forEach(function(polygon) {
        drawPolygon(polygon);
    })
}

// 拖动
function startDragging(loc) {
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
}

function startEditing() {
    canvas.style.cursor = 'pointer';
    editing = true;
}

function stopEditing() {
    canvas.style.cursor = 'crosshair';
    editing = false;
}

// 事件处理函数
canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if (editing) {
        polygons.forEach(function(polygon) {
            polygon.createPath(context);

            if (context.isPointInPath(loc.x, loc.y)) {
                startDragging(loc);
                dragging = polygon;
                draggingOffsetX = loc.x - polygon.x;
                draggingOffsetY = loc.y - polygon.y;
                return;
            }
        })
    } else {
        startDragging(loc);
        dragging = true;
    }
};

canvas.onmousemove = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();
    
    if (editing && dragging) {

        dragging.x = loc.x - draggingOffsetX;
        dragging.y = loc.y - draggingOffsetY;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid('lightgray', 10, 10);
        drawPolygons();
    } else {
        if (dragging) {
            restoreDrawingSurface();
            updateRubberband(loc);

            if (guidewires) {
                drawGuidewires(mousedown.x, mousedown.y);
            }
        }
    }
}

canvas.onmouseup = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    dragging = false;

    if (!editing) {
        restoreDrawingSurface();
        updateRubberband(loc);
    }
}

eraseAllButton.onclick = function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid('lightgray', 10, 10);
    saveDrawingSurface()
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value;
}

fillStyleSelect.onchange = function (e) {
    context.fillStyle = fillStyleSelect.value;
}

editCheckbox.onchange = function(e) {
    if (editCheckbox.checked) {
        startEditing();
    } else {
        stopEditing();
    }
}

context.strokeStyle = strokeStyleSelect.value;
context.fillStyleSelect = fillStyleSelect.value;

context.shadowColor = 'rgba(0, 0, 0, 0.4)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

drawGrid('lightgray', 10, 10);