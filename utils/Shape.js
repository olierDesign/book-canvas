/*
 * 形状
 */

var Shape = function () {
    this.x = undefined;
    this.y = undefined;
    this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
    this.fillStyle = 'rgba(147, 197, 114, 0.8)';
};

Shape.prototype = {
    // 检测是否重叠的方法
    collidesWidth: function(shape) {
        var axes = this.getAxes().concat(shape.getAxes());
        return !this.separationOnAxes(axes, shape);
    },

    separationOnAxes: function(axes, shape) {
        for (var i = 0; i < axes.length; ++i) {
            var axis = axes[i];
            projection1 = shape.project(axis);
            projection2 = this.project(axis);

            if (!projection1.overlaps(projection2)) {
                return true;
            }
        }

        return false;
    },

    project: function(axis) {
        throw 'project(axis) not implemented';
    },

    getAxes: function() {
        throw 'getAxes() not implemented';
    },

    move: function(dx, dy) {
        throw 'move(dx, dy) not implemented';
    },

    // 绘画方法
    createPath: function(context) {
        throw 'createPath(context) not implemented';
    },

    fill: function(context) {
        context.save();
        context.fillStyle = this.fillStyle;
        this.createPath(context);
        context.fill();
        context.restore();
    },

    stroke: function(context) {
        context.save();
        context.strokeStyle = this.strokeStyle;
        this.createPath(context);
        context.stroke();
        context.restore();
    },
    isPointInPath: function(context, x, y) {
        this.createPath(context);
        return context.isPointInPath(x, y);
    }
};

/*
 * 多边形
 */

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

Polygon.prototype.collidesWidth = function (shape) {
    var axes = shape.getAxes();

    if (axes === undefined) {
        return polygonCollidesWidthCircle(this, shape);
    } else {
        axes.concat(this.getAxes());
        return !this.separationOnAxes(axes, shape);
    }
};

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

/*
 * 圆形
 */
var Circle = function (x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
    this.fillStyle = 'rgba(147, 197, 114, 0.8)';
}

Circle.prototype = new Shape();

Circle.prototype.collidesWidth = function (shape) {
    var point,
        length,
        min = 10000,
        v1,
        v2,
        edge,
        perpendicular,
        normal,
        axes = shape.getAxes(),
        distance;

    if (axes === undefined) {   // 比较的图形是圆形
        distance = Math.sqrt(Math.pow(shape.x - this.x, 2) + Math.pow(shape.y - this.y, 2));
        return distance < Math.abs(this.radius + shape.radius);
    } else {    // 比较的图形是多边形
        return polygonCollidesWidthCircle(shape, this);
    }
};

Circle.prototype.getAxes = function () {
    return undefined;
};

Circle.prototype.project = function (axis) {
    var scalars = [],
        point = new Point(this.x, this.y),
        dotProduct = new Vector(point.x, point.y).dotProduct(axis);

    scalars.push(dotProduct);
    scalars.push(dotProduct + this.radius);
    scalars.push(dotProduct - this.radius);

    return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
};

Circle.prototype.move = function (dx, dy) {
    this.x += dx;
    this.y += dy;
}

Circle.prototype.createPath = function (context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
}

/*
 * 检测多边形与圆形之间的碰撞
 */

function getPolygonPointClosestToCircle(polygon, circle) {
    var min = 10000,
        length,
        testPoint,
        closestPoint;

    for (var i = 0; i < polygon.points.length; i++) {
        testPoint = polygon.points[i];
        length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2) + Math.pow(testPoint.y - circle.y, 2));

        if (length < min) {
            min = length;
            closestPoint = testPoint;
        }
    }

    return closestPoint;
}

function polygonCollidesWidthCircle(polygon, circle) {
    var min = 10000,
        v1,
        v2,
        edge,
        perpendicular,
        normal,
        axes = polygon.getAxes(),
        closestPoint = getPolygonPointClosestToCircle(polygon, circle);

    v1 = new Vector(circle.x, circle.y);
    v2 = new Vector(closestPoint.x, closestPoint.y);

    axes.push(v1.subtract(v2).normalize());

    return !polygon.separationOnAxes(axes, circle);
}