var Sprite = function(name, painter, behaviors) {
    if (name !== undefined) {
        this.name = name;
    }

    if (painter != undefined) {
        this.painter = painter;
    }

    this.top = 0;
    this.left = 0;
    this.width = 10;
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.visible = true;
    this.animating = false;
    this.behaviors = behaviors || [];

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
};

// 图像绘制器
var ImagePainter = function (imageUrl) {
    this.image = new Image();
    this.image.src = imageUrl;
};

ImagePainter.prototype = {
    paint: function(sprite, context) {
        if (this.image.complete) {
            context.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
        }
    }
}

// 精灵表绘制器
/**
 * spritesheet = new Image();
 * spritesheet.src = './running.jpeg';
 * spritesheet.onload = function() {
     sprite.paint(context);
   }
 */
var SpriteSheetPainter = function (cells) {
    this.cells = cells || [];
    this.cellIndex = 0;
};

SpriteSheetPainter.prototype = {
    advance: function() {
        if (this.cellIndex === this.cells.length - 1) {
            this.cellIndex = 0;
        } else {
            this.cellIndex++;
        }
    },

    paint: function (sprite, context) {
        var cell = this.cells[this.cellIndex];
        context.drawImage(spritesheet, cell.left, cell.top, cell.width, cell.height, sprite.left, sprite.top, cell.width, cell.height);
    }
}