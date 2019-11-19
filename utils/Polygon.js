// 多边形

var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var Polygon  = function () {
    this.points = [];
    this.strokeStyle = 'blue';
    this.fillStyle = 'white';
};

Polygon.prototype = new Shape();

Polygon.prototype.getAxes = function () {
    var v1 = new Vector(),
        v2 = new Vector(),
        axes = [];

    for (var i = 0; i < this.points.length - 1; i++) {
        v1.x = this.points[i].x;
        v1.y = this.points[i].y;

        v2.x = this.points[i+1].x;
        v2.y = this.points[i+1].y;

        axes.push(v1.edge(v2).normal());
    }

    v1.x = this.points[this.points.length - 1].x;
    v1.y = this.points[this.points.length - 1].y;

    v2.x = this.points[0].x;
    v2.y = this.points[0].y;

    axes.push(v1.edge(v2).normal());

    return axes;
};

Polygon.prototype.project = function (axis) {
    var scalars = [],
        v = new Vector();

    this.points.forEach(function(point) {
        v.x = point.x;
        v.y = point.y;
        scalars.push(v.dotProduct(axis))
    });

    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
};

Polygon.prototype.addPoint = function (x, y) {
    this.points.push(new Point(x, y));
};

Polygon.prototype.createPath = function (context) {
    if (this.points.length === 0) {
        return;
    }

    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);

    for (var i = 0; i < this.points.length; ++i) {
        context.lineTo(this.points[i].x, this.points[i].y);
    }

    context.closePath();
}

Polygon.prototype.move = function (dx, dy) {
    for (var i = 0, point; i < this.points.length; i++) {
        point = this.points[i];
        point.x += dx;
        point.y += dy;
    }
}