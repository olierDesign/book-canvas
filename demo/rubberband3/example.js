var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    image = new Image(),
    imageData,
    imageDataCopy = context.createImageData(canvas.width, canvas.height),

    mousedown = {},
    rubberbandRectangle = {},
    dragging = false;

function windowToCanvas(x, y) {
    var canvasRectangle = canvas.getBoundingClientRect();

    return {
        x: x - canvasRectangle.left,
        y: y - canvasRectangle.top
    }
}

function copyCanvasPixels() {
    var i = 0;

    for (var i = 0; i < imageData.data.length - 4; i += 4) {
        imageDataCopy.data[i] = imageData.data[i];
        imageDataCopy.data[i+1] = imageData.data[i+1];
        imageDataCopy.data[i+2] = imageData.data[i+2];
        imageDataCopy.data[i+3] = imageData.data[i+3] / 2;
    }
}

function captureCanvasPixels() {
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    copyCanvasPixels();
}

function restoreRubberbandPixels() {
    var deviceWidthOverCSSPixels = imageData.width / canvas.width;
    var deviceHeightOverCSSPixels = imageData.height / canvas.height;

    context.putImageData(imageData, 0, 0);
    context.putImageData(
        imageDataCopy,
        0, 0,
        rubberbandRectangle.left + context.lineWidth,
        rubberbandRectangle.top + context.lineWidth,
        (rubberbandRectangle.width - 2 * context.lineWidth) * deviceWidthOverCSSPixels,
        (rubberbandRectangle.height - 2 * context.lineWidth) * deviceHeightOverCSSPixels
    )
}

function setRubberbandRectangle(x, y) {
    rubberbandRectangle.left = Math.min(x, mousedown.x);
    rubberbandRectangle.top = Math.min(y, mousedown.y);
    rubberbandRectangle.width = Math.abs(x - mousedown.x);
    rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

function drawRubberband() {
    context.strokeRect( rubberbandRectangle.left + context.lineWidth,
                        rubberbandRectangle.top + context.lineWidth,
                        rubberbandRectangle.width - 2 * context.lineWidth,
                        rubberbandRectangle.height - 2 * context.lineWidth);
}

function rubberbandStart(x, y) {
    mousedown.x = x;
    mousedown.y = y;

    rubberbandRectangle.left = x;
    rubberbandRectangle.top = y;
    rubberbandRectangle.width = 0;
    rubberbandRectangle.height = 0;

    dragging = true;

    captureCanvasPixels();
}

function rubberbandStretch(x, y) {
    setRubberbandRectangle(x, y);

    if (rubberbandRectangle.width > 2 * context.lineWidth &&
        rubberbandRectangle.height > 2 * context.lineWidth) {
        if (imageData != undefined) {
            restoreRubberbandPixels();
        }

        drawRubberband();
    }
}

function rubberbandEnd() {
    context.putImageData(imageData, 0, 0);

    context.drawImage(canvas,
                      rubberbandRectangle.left + 2 * context.lineWidth,
                      rubberbandRectangle.top + 2 * context.lineWidth,
                      rubberbandRectangle.width - 4 * context.lineWidth,
                      rubberbandRectangle.height - 4 * context.lineWidth,
                      0, 0, canvas.width, canvas.height);

    dragging = false;
    imageData = undefined;
}

canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();
    rubberbandStart(loc.x, loc.y);
}

canvas.onmousemove = function(e) {
    var loc;

    if (dragging) {
        loc = windowToCanvas(e.clientX, e.clientY);
        rubberbandStretch(loc.x, loc.y);
    }
}
canvas.onmouseup = function(e) {
    rubberbandEnd();
}

image.src = './u2tj4vpp0q.jpg';

image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

context.strokeStyle = 'navy';
context.lineWidth = 1.0;