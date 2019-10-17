var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

context.strokeStyle = 'blue';
context.fillStyle = 'red';
context.lineWidth = '2';

// rectangles
context.lineWidth = '5';
context.beginPath();
context.rect(80, 150, 150, 100);
context.stroke();

context.beginPath();
context.rect(400, 150, 150, 100);
context.fill();

context.beginPath();
context.rect(750, 150, 150, 100);
context.stroke();
context.fill();

// open arcs
context.beginPath();
context.arc(150, 370, 60, 0, Math.PI * 3 / 2);
context.stroke();

context.beginPath();
context.arc(475, 370, 60, 0, Math.PI * 3 / 2);
context.fill();

context.beginPath();
context.arc(820, 370, 60, 0, Math.PI * 3 / 2);
context.stroke();
context.fill();

// closed arcs
context.beginPath();
context.arc(150, 550, 60, 0, Math.PI * 3 / 2);
context.closePath();
context.stroke();

context.beginPath()
context.arc(475, 550, 60, 0, Math.PI * 3 / 2);
context.closePath();
context.fill();

context.beginPath()
context.arc(850, 550, 60, 0, Math.PI * 3 / 2);
context.closePath();
context.stroke();
context.fill();