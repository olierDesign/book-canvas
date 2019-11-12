var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    // 获取原生的 moveTo ，赋值给 moveToFunction
    moveToFunction = CanvasRenderingContext2D.prototype.moveTo;

// 在原型链上添加属性 lastMoveToLocation，放置最后一个 moveTo 的 X, Y
CanvasRenderingContext2D.prototype.lastMoveToLocation = {};

// 重写 moveTo 方法
CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
    moveToFunction.apply(context, [x, y]);
    this.lastMoveToLocation.x = x;
    this.lastMoveToLocation.y = y;
}

// 自定义虚线 dashedLineTo
CanvasRenderingContext2D.prototype.dashedLineTo = function(x, y, dashedLength) {
    dashedLength = dashedLength === undefined ? 5 : dashedLength;

    var startX = this.lastMoveToLocation.x;
    var startY = this.lastMoveToLocation.y;

    var deltaX = x - startX;
    var deltaY = y - startY;

    // 两点之间需要画多少条线段
    var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashedLength);

    for (var i = 0; i < numDashes; i++) {
        context[i % 2 === 0 ? 'moveTo' : 'lineTo'](
            startX + (deltaX / numDashes) * i,
            startY + (deltaY / numDashes) * i
        )
    }

    this.moveTo(x, y);
}

context.lineWidth = 3;
context.strokeStyle = 'blue';

context.moveTo(20, 20);
context.dashedLineTo(context.canvas.width - 20, 20);
context.dashedLineTo(context.canvas.width - 20, context.canvas.height - 20);
context.dashedLineTo(20, context.canvas.height - 20);
context.dashedLineTo(20, 20);
context.dashedLineTo(context.canvas.width - 20, context.canvas.height - 20);
context.stroke();