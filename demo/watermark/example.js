var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    image = new Image(),

    scaleOutput = document.getElementById('scaleOutput'),
    scaleSlider = document.getElementById('scaleSlider'),
    scale = scaleSlider.nodeValue,
    scale = 1.0,

    MINIMUM_SCALE = 1.0,
    MAXIMUM_SCALE = 3.0;

function drawScaled() {
    var w = canvas.width,
        h = canvas.height,
        sw = w * scale,
        sh = h * scale;

    context.clearRect(0, 0, canvas.width, canvas.height);
    // 1 先把图平铺画布
    context.drawImage(image, 0, 0, w, h);
    // 2 把画布按比例缩放
    // 3 画水印
    // 2 3 可换序
    context.drawImage(canvas, 0, 0, w, h, w/2 - sw /2, h/2 - sh/2, sw, sh);
    drawWatermark();
}

function drawScaleText(value) {
    var text = parseFloat(value).toFixed(2);
    var percent = parseFloat(value - MINIMUM_SCALE) / parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);
    scaleOutput.innerText = text;
    percent = percent < 0.35 ? 0.35 : percent;
    scaleOutput.style.fontSize = percent * MAXIMUM_SCALE / 1.5 + 'em'; 
}

function drawWatermark() {
    var lineOne = 'Copyright',
        lineTwo = 'Acme Inc.',
        textMetrics,
        FONT_HEIGHT = 128;

    context.save();
    context.font = FONT_HEIGHT + 'px Arial';
    context.globalAlpha = 0.6;
    context.translate(canvas.width / 2, canvas.height / 2);

    textMetrics = context.measureText(lineOne);
    context.fillText(lineOne, -textMetrics.width / 2, -FONT_HEIGHT / 2);
    context.strokeText(lineOne, -textMetrics.width / 2, -FONT_HEIGHT / 2);

    textMetrics = context.measureText(lineTwo);
    context.fillText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT / 2);
    context.strokeText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT / 2);

    context.restore();
}

scaleSlider.onchange = function(e) {
    scale = scaleSlider.value;

    if (scale < MINIMUM_SCALE) {
        scale = MINIMUM_SCALE
    } else if (scale > MAXIMUM_SCALE) {
        scale = MAXIMUM_SCALE
    }

    drawScaled();
    drawScaleText(scale);
}

context.fillStyle = 'cornflowerblue';
context.strokeStyle = 'yellow';
context.shadowColor = 'rgba(50, 50, 50, 1.0)';
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 10;

var glassSize = 150;
image.src = 'https://imgcache.qq.com/open_proj/proj_qcloud_v2/rocket_images/1570603567600_utmkbzipbbehwu3di.png';
image.onload = function(e) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawWatermark();
    drawScaleText(scale);
}