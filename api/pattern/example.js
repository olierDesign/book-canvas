var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    repeatRadio = document.getElementById('repeatRadio'),
    repeatXRadio = document.getElementById('repeatXRadio'),
    repeatYRadio = document.getElementById('repeatYRadio'),
    noRepeatRadio = document.getElementById('noRepeatRadio'),
    image = new Image();

function fillCanvasWithPattern(repeatString) {
    var pattern = context.createPattern(image, repeatString);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = pattern;
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

repeatRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat')
}

repeatXRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat-x');
}

repeatYRadio.onclick = function(e) {
    fillCanvasWithPattern('repeat-y');
}

noRepeatRadio.onclick = function(e) {
    fillCanvasWithPattern('no-repeat');
}

image.src = 'https://imgcache.qq.com/open_proj/proj_qcloud_v2/college/qcloud-train/build/src/new-pages/Path/css/img/path-icon-video-primaryc.svg';
image.onload = function(e) {
    fillCanvasWithPattern('repeat')
}