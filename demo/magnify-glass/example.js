var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    magnifyingGlassX,
    magnifyingGlassY,
    magnifyingGlassRadius = 50,
    magnifyRectangle = {},
    imageData,
    dragging = true,
    magnificationScale = 2,
    image = new Image();

function windowToCanvas(x, y) {
    var canvasRectangle = canvas.getBoundingClientRect();

    return {
        x: x - canvasRectangle.left,
        y: y - canvasRectangle.top
    }
}

function calculateMagnifyRectangle(mouse) {
    magnifyRectangle.left = mouse.x - magnifyingGlassRadius;
    magnifyRectangle.top = mouse.y - magnifyingGlassRadius;
    magnifyRectangle.width = 2 * magnifyingGlassRadius;
    magnifyRectangle.height = 2 * magnifyingGlassRadius;
}

function eraseMagnifyingGlass() {
    if (imageData != null) {
        context.putImageData(imageData, magnifyRectangle.left, magnifyRectangle.top);
    }
}

function drawMagnifyingGlass(mouse) {
    var scaledMagnifyRectangle = null;

    magnifyingGlassX = mouse.x;
    magnifyingGlassY = mouse.y;

    calculateMagnifyRectangle(mouse);

    imageData = context.getImageData(magnifyRectangle.left,
                                     magnifyRectangle.top,
                                     magnifyRectangle.width, 
                                     magnifyRectangle.height);
                                    
    context.save();

    scaledMagnifyRectangle = {
        width: magnifyRectangle.width * magnificationScale,
        height: magnifyRectangle.height * magnificationScale,
    }

    setClip();

    context.drawImage(canvas,
                      magnifyRectangle.left,
                      magnifyRectangle.top,
                      magnifyRectangle.width,
                      magnifyRectangle.height,
                      magnifyRectangle.left + magnifyRectangle.width / 2 - scaledMagnifyRectangle.width /2,
                      magnifyRectangle.top + magnifyRectangle.height / 2 - scaledMagnifyRectangle.height /2,
                      scaledMagnifyRectangle.width,
                      scaledMagnifyRectangle.height);

    context.restore();
    drawMagnifyingGlassCircle(mouse);
}

function drawMagnifyingGlassCircle(mouse) {
    context.save();
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(mouse.x, mouse.y, magnifyingGlassRadius - context.lineWidth, 0, Math.PI * 2, false);
    context.stroke();
    context.restore();
}

function setClip() {
    context.beginPath();
    context.arc(magnifyingGlassX, magnifyingGlassY, magnifyingGlassRadius, 0, Math.PI * 2, false);
    context.clip();
}

canvas.onmousemove = function (e) {
    e.preventDefault();
    var loc = windowToCanvas(e.clientX, e.clientY);

    if(dragging) {
        eraseMagnifyingGlass();
        drawMagnifyingGlass(loc);
    }
}

image.src = './u2tj4vpp0q.jpg';

image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

