// 投影
var Projection = function (min, max) {
    this.min = min;
    this.max = max;
}

Projection.prototype = {
    // 是否重叠
    overlaps: function (projection) {
        return this.max > projection.min && projection.max > this.min;
    }
}