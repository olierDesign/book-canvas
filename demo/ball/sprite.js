var Sprite = function(name, painter, behaviors) {
    if (name != undefined) {
        this.name = name
    }

    if (painter != undefined) {
        this.painter = painter;
    }

    this.top = 0;                           // y 坐标
    this.left = 0;                          // x 坐标
    this.width = 10;                        // 宽度
    this.height = 10;                       // 高度
    this.velocityX = 0;                     // 水平速度
    this.velocityY = 0;                     // 垂直速度
    this.visible = true;                    // 可见性
    this.animating = false;                 // 是否正在执行
    this.behaviors = behaviors || {};       // 行为对象数组

    return this;
}

Sprite.prototype = {
    paint: function (context) {
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, context);
        }
    },

    update: function(context, time) {
        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].execute(this, context, time);
        }
    }
}