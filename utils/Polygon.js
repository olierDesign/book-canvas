import { shape } from "prop-types";

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

var Polygon  = function() {
    this.points = [];
    this.strokeStyle = 'blue';
    this.fillStyle = 'white';
};

Polygon.prototype = new Shape();

Polygon.prototype.getAxes = function() {
    var v1 = new Vector(),
        v2 = new Vector(),
        
}