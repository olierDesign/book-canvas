var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    shapes = [],

    ballSprite = new Sprite('ball', new ImagePainter('tennis-ball.png'))

    polygonPoints = [
        [new Point(250, 150), new Point(250, 250), new Point(350, 250)],
        [new Point(100, 100), new Point(100, 150), new Point(150, 150), new Point(150, 100)],
        [new Point(400, 100), new Point(380, 150), new Point(500, 150), new Point(520, 100)]
    ],
    polygonStrokeStyles = ['blue', 'yellow', 'red'],
    polygonFillStyle = [
        'rgba(255, 255, 0, 0.7)',
        'rgba(100, 140, 230, 0.6)',
        'rgba(255, 255, 255, 0.8)'
    ],
    circle1 = new Circle(150, 75, 20),
    circle2 = new Circle(350, 25, 30),

    mousedown= {x: 0, y: 0},
    lastdrag= {x: 0, y: 0},
    shapeBeingDragged = undefined;

/* 函数
 * 
 */
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();

    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    }
}

function drawShapes() {
    shapes.forEach(function(shape) {
        shape.stroke(context);
        shape.fill(context);
    })
}

function detecCollisions() {
    var textY = 30,
        numShapes = shapes.length,
        shape,
        i;
    
    if (shapeBeingDragged) {
        for (i = 0; i < numShapes; i++) {
            shape = shapes[i];

            if (shape !== shapeBeingDragged) {
                if (shapeBeingDragged.collidesWidth(shape)) {
                    context.fillStyle = shape.fillStyle;
                    context.fillText('collision', 20, textY);
                    textY +=40;
                }
            }
        }
    }
}

/* 事件处理函数
 * 
 */
canvas.onmousedown = function (e) {
    var location = windowToCanvas(e.clientX, e.clientY);

    shapes.forEach(function (shape) {
        if (shape.isPointInPath(context, location.x, location.y)) {
            shapeBeingDragged = shape;
            mousedown.x = location.x;
            mousedown.y = location.y;
            lastdrag.x = location.x;
            lastdrag.y = location.y;
        }
    });
};

canvas.onmousemove = function (e) {
    var location,
        dragvector;

    if (shapeBeingDragged !== undefined) {
        location = windowToCanvas(e.clientX, e.clientY);
        dragvector = {
            x: location.x - lastdrag.x,
            y: location.y - lastdrag.y
        };
        shapeBeingDragged.move(dragvector.x, dragvector.y);

        lastdrag.x = location.x;
        lastdrag.y = location.y;

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawShapes();
        detecCollisions();
    }
};

canvas.onmouseup = function (e) {
    shapeBeingDragged = undefined;
}
/* 初始化
 * 
 */
for (var i = 0; i < polygonPoints.length; i++) {
    var polygon = new Polygon(),
        points = polygonPoints[i];

    polygon.strokeStyle = polygonStrokeStyles[i];
    polygon.fillStyle = polygonFillStyle[i];

    points.forEach(function(point) {
        polygon.addPoint(point.x, point.y);
    });

    shapes.push(polygon);
}

shapes.push(circle1);
shapes.push(circle2);

shapes.push(new ImageShape('golfball.png', 50, 50));
shapes.push(new SpriteShape(ballSprite, 100, 100));

context.shadowColor = 'rgba(100, 140, 255, 0.5)';
context.shadowBlur = 4;
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.font = '38px Arial';

drawShapes();

context.save();
context.fillStyle = 'cornflowerblue';
context.font = '24px Arial';
context.fillText('Drag shapes over each other', 10, 25);
context.restore();