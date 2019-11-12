var image = new Image(),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    offscreenCanvas = document.createElement('canvas'),
    offscreenContext = offscreenCanvas.getContext('2d'),
    fadeButton = document.getElementById('fadeButton'),
    imageData,
    imageDataOffscreen,
    interval = null;

function increaseTransparency(imageData, steps) {
    var alpha,
        currentAlpha,
        step,
        length = imageData.data.length;

    for (var i = 3; i < imageData.data.length; i += 4) {
        alpha = imageDataOffscreen.data[i];

        if (alpha > 0) {
            currentAlpha = imageData.data[i];
            step = Math.ceil(alpha / steps);

            if (currentAlpha + step < alpha) {
                imageData.data[i] += step;
            } else {
                imageData.data[i] = alpha;
            }
        }
    }

    context.putImageData(imageData, 0, 0);
}

function animationComplete() {
    setTimeout(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, 1000)
}

function fadeIn(context, imageData, steps, millisecondsPerStep) {
    var frame = 0;

    for (var i = 3; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
    }

    interval = setInterval(() => {
        frame++;

        if (frame > steps) {
            clearInterval(interval);
            animationComplete();
        } else {
            increaseTransparency(imageData, steps);
        }
    }, millisecondsPerStep);
}

fadeButton.onclick = function(e) {
    fadeIn(context, imageData, 50, 1000 / 60);
}

image.src = './u2tj4vpp0q.jpg';
image.onload = function() {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenContext.drawImage(image, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    imageDataOffscreen = offscreenContext.getImageData(0, 0, canvas.width, canvas.height);
    imageData = offscreenContext.getImageData(0, 0, canvas.width, canvas.height);
}