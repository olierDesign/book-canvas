// 秒表
var Stopwatch = function() {}

Stopwatch.prototype = {
    startTime: 0,
    running: false,
    elapsed: undefined,

    // 开始计时
    start: function () {
        this.startTime = +new Date();
        this.running = true;
        this.elapsedTime = undefined;
    },

    // 结束计时
    stop: function () {
        this.elapsed = (+new Date()) - this.startTime;
        this.running = false;
    },

    // 计时时间
    getElapsedTime: function () {
        if (this.running) {
            return (+new Date()) - this.startTime;
        } else {
            return this.elapsed;
        }
    },

    // 是否处于计时状态
    isRunning: function () {
        return this.running;
    },

    // 计时时间重置为0
    reset: function() {
        this.elapsed = 0;
    }
}