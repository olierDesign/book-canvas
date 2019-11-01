var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    image = new Image(),

    scaleSlider = document.getElementById('scaleSlider'),
    scale = scaleSlider.value,
    MINIMUM_SCALE = 1.0,
    MAXIMUM_SCALE = 3.0;

function drawImage() {
    var w = canvas.width,
        h = canvas.height,
        sw = w * scale,
        sh = h * scale;

    context.clearRect(0, 0, w, h);
    context.drawImage(image, w/2 - sw/2, h/2 - sh/2, sw, sh);
}

function drawScaleText(value) {
    var text = parseFloat(value).toFixed(2);
    var percent = parseFloat(value - MINIMUM_SCALE) / parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);
    scaleOutput.innerText = text;
    percent = percent < 0.35 ? 0.35 : percent;
    scaleOutput.style.fontSize = percent * MAXIMUM_SCALE / 1.5 + 'em'
}

scaleSlider.onchange = function(e) {
    scale = e.target.value;

    if (scale < MINIMUM_SCALE) {
        scale = MINIMUM_SCALE;
    } else if (scale > MAXIMUM_SCALE) {
        scale = MAXIMUM_SCALE;
    }
    
    drawImage();
    drawScaleText(scale);
}

context.fillStyle = 'cornflowerblue';
context.strokeStyle = "yellow";
context.shadowColor = 'rgba(50, 50, 50, 1.0)';
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 10;

image.src = 'https://imgcache.qq.com/open_proj/proj_qcloud_v2/rocket_images/1570607865848_gmem1n1ymdmo0f6r.png';
image.onload = function(e) {
    drawImage();
    drawScaleText(scale);
};