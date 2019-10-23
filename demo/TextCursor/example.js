var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    drawingSurfaceImageData,
    cursor = new TextCursor();

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

function moveCursor(loc) {
    cursor.erase(context, drawingSurfaceImageData);
    cursor.draw(context, loc.x, loc.y);
}

canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    moveCursor(loc);
}

saveDrawingSurface();