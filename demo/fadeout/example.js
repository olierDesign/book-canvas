var image = new Image(),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    fadeButton = document.getElementById('fadeButton'),
    originalImageData = null,
    interval = null;

function increaseTransparency(imageData, x, y, steps) {
    var alpha,
        currentAlpha,
        step,
        length = imageData.data.length;

    for (var i = 3; i < length; i += 4) {
        alpha = originalImageData.data[i];
        
        if (alpha > 0 && imageData.data[i] > 0) {
            currentAlpha = imageData.data[i];
            step = Math.ceil(alpha / steps);        // 每次递减的透明度 = 总透明度 / 次数

            if (currentAlpha - step > 0) {
                imageData.data[i] -= step;
            } else {
                imageData.data[i] = 0;
            }
        }
    }

    context.putImageData(imageData, x, y);
}

function animationComplete() {
    setTimeout(function() {
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }, 1000);
}

function fadeOut(context, imageData, x, y, steps, millisecondsPerStep) {
    var frame = 0,
        length = imageData.data.length;

    interval = setInterval(function() {
        // 递增次数
        frame++;

        // 当递增次数大于规定次数
        if (frame > steps) {
            clearInterval(interval);

            animationComplete();
        } else {
            increaseTransparency(imageData, x, y, steps);
        }
    }, millisecondsPerStep);
}

fadeButton.onclick = function(e) {
    fadeOut(context, context.getImageData(0, 0, canvas.width, canvas.height),
            0, 0, 20, 1000 / 60);
}

image.src = './u2tj4vpp0q.jpg';
image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}