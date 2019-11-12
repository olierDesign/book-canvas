var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    angle = - Math.PI / 2,
    circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width / 2 - 2
    },
    stop = null;

context.fillStyle = '#999999';

function animate() {
    angle += Math.PI / 180;

    console.log(angle * 180 / Math.PI);

    if (angle >= 3 / 2 * Math.PI) {
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(circle.x + circle.radius * Math.cos(angle), circle.y + circle.radius * Math.sin(angle));
    context.arc(circle.x, circle.y, circle.radius, angle, 3 / 2 * Math.PI, false);
    context.fill();
    context.restore();

    stop = window.requestNextAnimationFrame(animate);
}

window.requestNextAnimationFrame(animate);