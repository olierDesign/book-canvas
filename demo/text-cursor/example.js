var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    blinkingInterval,
    BLINK_ON = 500,
    BLINK_OFF = 500,
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

function blinkCursor(loc) {
    blinkingInterval = setInterval(function() {
        cursor.erase(context, drawingSurfaceImageData);

        setTimeout(function() {
            cursor.draw(context, cursor.left, cursor.top + cursor.getHeight(context));
        }, BLINK_OFF);
    }, BLINK_ON + BLINK_OFF)
}

function moveCursor(loc) {
    cursor.erase(context, drawingSurfaceImageData);
    cursor.draw(context, loc.x, loc.y);

    if (!blinkingInterval) {
        blinkCursor(loc);
    }
}

canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    moveCursor(loc);
}

saveDrawingSurface();