// 向量
var Vector = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype = {
    // 向量距离
    getMagnitude: function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    },
    // 向量相加
    add: function (vector) {
        var v = new Vector();
        v.x = this.x + vector.x;
        v.y = this.y + vector.y;
        return v;
    },
    // 向量相减
    subtract: function (vector) {
        var v = new Vector();
        v.x = this.x - vector.x;
        v.y = this.y - vector.y;
        return v;
    },
    // 向量乘积
    dotProduct: function (vector) {
        return this.x * vector.x + this.y * vector.y;
    },
    // 边缘向量
    edge: function (vector) {
        return this.subtract(vector);
    },
    // 法（垂直）向量
    perpendicular: function () {
        var v = new Vector();
        v.x = this.y;
        v.y = 0 - this.x;
        return v;
    },
    // 单位向量
    normalize: function () {
        var v = new Vector(0, 0),
            m = this.getMagnitude();

        if (m != 0) {
            v.x = this.x / m;
            v.y = this.y / m;
        }

        return v;
    },
    normal: function () {
        var p = this.perpendicular();
        return p.normalize();
    }
};