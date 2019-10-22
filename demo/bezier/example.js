var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    editCheckbox = document.getElementById('editCheckbox'),
    eraseAllButton = document.getElementById('eraseAllButton'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    guidewireCheckbox = document.getElementById('guidewireCheckbox'),
    instructions = document.getElementById('instructions'),
    instructionsOkayButton = document.getElementById('instructionsOkayButton'),
    instructionsNoMoreButton = document.getElementById('instructionsNoMoreButton'),

    showInstructions = true,

    AXIS_MARGIN = 40,
    HORIZONTAL_TICK_SPACING = 10,
    VERTICAL_TICK_SPACING = 10,
    TICK_SIZE = 10,

    AXIS_ORIGIN = {
        x: AXIS_MARGIN, y: canvas.height - AXIS_MARGIN
    },
    AXIS_TOP = AXIS_MARGIN,
    AXIS_RIGHT = canvas.width - AXIS_MARGIN,
    AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
    AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

    NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
    NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING,

    // 网格
    GRID_STROKE_STYLE = 'lightblue',
    GRID_SPACING = 10,

    // 控制点
    CONTROL_POINT_RADIUS = 5,
    CONTROL_POINT_STROKE_STYLE = 'blue',
    CONTROL_POINT_FILL_STYLE = 'rgba(255, 255, 0, 0.5)',

    // 端点
    END_POINT_STROKE_STYLE = 'navy',
    END_POINT_FILL_STYLE = 'rgba(0, 255, 0, 0.5)',

    // 参考线
    GUIDEWIRE_STROKE_STYLE = 'rgba(0, 0, 230, 0.4)',

    drawingImageData,

    mousedown = {},
    rubberbandRect = {},

    dragging = false,
    draggingPoint = false,

    endPoints = [{}, {}],
    controlPoints = [{}, {}],
    editing = false,

    guidewires = guidewireCheckbox.checked;

// ---------- Function ----------
// 画网格
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

// 转换成 canvas 坐标
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();

    return {
        x : x - bbox.left * (canvas.width / bbox.width),
        y : y - bbox.top * (canvas.height / bbox.height)
    }
}

// 存储 | 恢复 画面
function saveDrawingSurface() {
    drawingImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}
function restoreDrawingSurface() {
    context.putImageData(drawingImageData, 0, 0);
}

// 橡皮筋
function updateRubberbandRectangle(loc) {
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);
    
    rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
    rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

// 画线
function drawBezierCurve () {
    context.beginPath();
    context.moveTo(endPoints[0].x, endPoints[0].y);
    context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[1].x, endPoints[1].y);
    context.stroke();
}
// 获取贝塞尔曲线的两个端点和两个控制点
function updateEndAndControlPoints() {
    endPoints[0].x = rubberbandRect.left;
    endPoints[0].y = rubberbandRect.top;

    endPoints[1].x = rubberbandRect.left + rubberbandRect.width;
    endPoints[1].y = rubberbandRect.top + rubberbandRect.height;

    controlPoints[0].x = rubberbandRect.left;
    controlPoints[0].y = rubberbandRect.top + rubberbandRect.height;

    controlPoints[1].x = rubberbandRect.left + rubberbandRect.width;
    controlPoints[1].y = rubberbandRect.top;
}
// 画贝塞尔曲线
function drawRubberbandShape(loc) {
    updateEndAndControlPoints();
    drawBezierCurve();
}
// 更新橡皮筋，从而更新贝塞尔曲线
function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc);
}

// 参考线
function drawHorizontalGuidewire(y) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
}

function drawVerticalGuidewire(x) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, canvas.height);
    context.stroke();
}

function drawGuidewires(x, y) {
    context.save();
    context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
    context.lineWidth = 0.5;
    drawVerticalGuidewire(x);
    drawHorizontalGuidewire(y);
    context.restore();
}

// 画贝塞尔的端点和控制点
function drawControlPoint(index) {
    context.beginPath();
    context.arc(controlPoints[index].x, controlPoints[index].y, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);

    context.stroke();
    context.fill();
}

function drawControlPoints() {
    context.save();
    context.strokeStyle = CONTROL_POINT_STROKE_STYLE;
    context.fillStyle = CONTROL_POINT_FILL_STYLE;
    drawControlPoint(0);
    drawControlPoint(1);
    // context.stroke();
    // context.fill();
    context.restore();
}

function drawEndPoint(index) {
    context.beginPath();
    context.arc(endPoints[index].x, endPoints[index].y, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);

    context.stroke();
    context.fill();
}

function drawEndPoints() {
    context.save();
    context.strokeStyle = END_POINT_STROKE_STYLE;
    context.fillStyle = END_POINT_FILL_STYLE;
    drawEndPoint(0);
    drawEndPoint(1);

    // context.stroke();
    // context.fill();
    context.restore();
}

function drawControlAndEndPoints() {
    drawControlPoints();
    drawEndPoints();
}

// 判断当前点是否在 端点 | 控制点 内
function cursorInEndPoint(loc) {
    var pt;

    endPoints.forEach(function(point) {
        context.beginPath();
        context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);

        if (context.isPointInPath(loc.x, loc.y)) {
            pt = point;
        }
    });

    return pt;
}
 
function cursorInControlPoint(loc) {
    var pt;

    controlPoints.forEach(function(point) {
        context.beginPath();
        context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, 2 * Math.PI, false);

        if (context.isPointInPath(loc.x, loc.y)) {
            pt = point;
        }
    });

    return pt;
}

function updateDraggingPoint(loc) {
    draggingPoint.x = loc.x;
    draggingPoint.y = loc.y;
}

// 事件处理函数
canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if (!editing) {
        saveDrawingSurface();
        mousedown.x = loc.x;
        mousedown.y = loc.y;
        // updateRubberbandRectangle(loc);
        dragging = true;
    } else {
        draggingPoint = cursorInControlPoint(loc) || cursorInEndPoint(loc);
    }
}

canvas.onmousemove = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    if (dragging || draggingPoint) {
        e.preventDefault();
        restoreDrawingSurface();

        if (guidewires) {
            drawGuidewires(loc.x, loc.y);
        }
    }

    if (dragging) {
        updateRubberband(loc);
        drawControlAndEndPoints();
    }

    else if (draggingPoint) {
        updateDraggingPoint(loc);
        drawControlAndEndPoints();
        drawBezierCurve();
    }
}

canvas.onmouseup = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    restoreDrawingSurface();

    if (!editing) {
        updateRubberband(loc);
        drawControlAndEndPoints();
        dragging = false;
        editing = false;
        if (showInstructions) {
            instructions.style.display = 'inline';
        }
    } else {
        // if (draggingPoint) {
        //     drawControlAndEndPoints();
        // }
        // else {
        //     editing = false;
        // }

        drawControlAndEndPoints();
        editing = false;
        drawBezierCurve();
        draggingPoint = undefined;
    }
}

eraseAllButton.onclick = function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);
    saveDrawingSurface();
    editing = false;
    dragging = false;
    draggingPoint = undefined;
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value;
}

guidewireCheckbox.onchange = function(e) {
    guidewires = guidewireCheckbox.checked;
}

instructionsOkayButton.onclick = function(e) {
    instructions.style.display = 'none';
}

instructionsNoMoreButton.onclick = function(e) {
    instructions.style.display = 'none';
    showInstructions = false;
}

function startEditing() {
    canvas.style.cursor = 'pointer';
    editing = true;
}

function stopEditing() {
    canvas.style.cursor = 'crosshair';
    editing = false;
}

editCheckbox.onchange = function(e) {
    if (editCheckbox.checked) {
        startEditing();
    } else {
        stopEditing();
    }
}

context.strokeStyle = strokeStyleSelect.value;
drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);