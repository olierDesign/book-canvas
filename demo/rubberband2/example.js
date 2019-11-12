var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    eraseAllButton = document.getElementById('eraseAllButton'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    guidewireCheckbox = document.getElementById('guidewireCheckbox'),
    drawingSurfaceImageData,
    mousedown = {},
    rubberbandRect = {},
    dragging = false,
    guidewires = guidewireCheckbox.checked;

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

function updateRubberbandRectangle(loc) {
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    rubberbandRect.left = loc.x < mousedown.x ? loc.x : mousedown.x;
    rubberbandRect.top = loc.y < mousedown.y ? loc.y : mousedown.y;
}

function drawRubberbandShap(loc) {
    context.beginPath();
    context.moveTo(mousedown.x, mousedown.y);
    context.lineTo(loc.x, loc.y);
    context.stroke();
}

function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShap(loc);
}

function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
}

function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, canvas.height);
    context.stroke();
}

function drawGuidewires(x, y) {
    context.save();
    
    context.strokeStyle = 'rgba(0, 0, 230, 0.4)';
    context.lineWidth = 0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    context.restore();
}

canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;
}

canvas.onmousemove = function(e) {
    var loc;

    if (dragging) {
        e.preventDefault();
        loc = windowToCanvas(e.clientX, e.clientY);
        restoreDrawingSurface();
        updateRubberband(loc);

        if (guidewires) {
            drawGuidewires(loc.x, loc.y);
        }
    }
}

canvas.onmouseup = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    restoreDrawingSurface();
    updateRubberband(loc);
    dragging = false;
}

eraseAllButton.onclick = function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(context, 'lightgray', 10, 10);
    saveDrawingSurface();
}

strokeStyleSelect.onchange = function(e) {
    context.strokeStyle = strokeStyleSelect.value;
}

guidewireCheckbox.onchange = function(e) {
    guidewires = guidewireCheckbox.checked;
}

context.strokeStyle = strokeStyleSelect.value;
drawGrid(context, 'lightgray', 10, 10);