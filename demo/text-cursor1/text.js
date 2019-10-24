// 光标
TextCursor = function(width, fillStyle) {

    this.fillStyle = fillStyle || 'rgba(0, 0, 0, 0.5)';
    this.width = width || 1;
    this.left = 0;
    this.top = 0;
}

TextCursor.prototype = {
    getHeight: function(context) {
        var h = context.measureText('W').width;
        return Math.ceil(Math.ceil(h + h / 6));
    },
    createPath: function(context) {
        context.beginPath();
        context.rect(this.left, this.top, this.width, this.getHeight(context));
    },
    draw: function(context, left, bottom) {
        context.save();

        this.left = left;
        this.top = bottom - this.getHeight(context);

        this.createPath(context);

        context.fillStyle = this.fillStyle;
        context.fill();

        context.restore();
    },
    erase: function(context, imageDate) {
        context.putImageData(imageDate, 0, 0, this.left, this.top, this.width + 1, this.getHeight(context));
    }
};

// 文本
TextLine = function(x, y) {
    this.text = '';
    this.left = x;
    this.bottom = y;
    this.caret = 0;
}

TextLine.prototype = {
    insert: function(text) {
        this.text = this.text.substr(0, this.caret) + text + this.text.substr(this.caret);
        this.caret += text.length;
    },
    removeCharacterBeforeCaret: function() {
        if (this.caret === 0) {
            return;
        }

        this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret);

        this.caret--;
    },
    getWidth: function(context) {
        return context.measureText(this.text).width;
    },
    getHeight: function(context) {
        var h = context.measureText('W').width;
        return h + h / 6;
    },
    draw: function(context) {
        context.save();
        context.textAlign = 'start';
        context.textBaseline = 'bottom';
        // context.strokeText(this.text, this.left, this.bottom);
        context.fillText(this.text, this.left, this.bottom);
        context.restore();
    },
    erase: function(context, imageDate) {
        context.putImageData(imageDate, 0, 0);
    }
}