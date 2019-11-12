// 秒表
Stopwatch = function() {}

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

// 动画计时器
/* 参数
// duration(总时长)
// timeWarp(扭曲函数): 返回一个扭曲后的播放进度百分比
**/
AnimationTimer = function (duration, timeWarp) {
    if (duration != undefined) {
        this.duration = duration;
    }

    if (timeWarp !== undefined) {
        this.timeWarp = timeWarp;
    }
    this.stopwatch = new Stopwatch();
}

AnimationTimer.prototype = {
    start: function () {
        this.stopwatch.start();
    },

    stop: function () {
        this.stopwatch.stop();
    },

    getElapsedTime: function () {
        var elapsedTime = this.stopwatch.getElapsedTime(),
            // 实际播放百分比
            percentComplete = elapsedTime / this.duration;

        // 如果动画计时已结束
        if (!this.stopwatch.running) {
            return undefined;
        }
        // 如果动画计时中 && 没有扭曲函数
        if (this.timeWarp == undefined) {
            return elapsedTime;
        }

        // 如果有扭曲函数
        return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
    },

    isRunning: function () {
        return this.stopwatch.isRunning();
    },

    isOver: function () {
        return this.stopwatch.getElapsedTime() > this.duration;
    }
}

// 扭曲函数静态方法
var DEFAULT_ELASTIC_PASSES = 3;

AnimationTimer.makeEaseIn = function(strength) {
    return function (percentComplete) {
        return Math.pow(percentComplete, strength * 2);
    };
}

AnimationTimer.makeEaseOut = function(strength) {
    return function (percentComplete) {
        return 1 - Math.pow(1 - percentComplete, strength * 2);
    };
}

AnimationTimer.makeEaseInOut = function () {
    return function (percentComplete) {
        return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
    };
}

AnimationTimer.makeElastic = function (passes) {
    passes = passes || DEFAULT_ELASTIC_PASSES;

    return function (percentComplete) {
        return ( (1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete) ) + percentComplete;
    };
}

AnimationTimer.makeBounce = function (bounces) {
    var fn = AnimationTimer.makeElastic(bounces);

    return function (percentComplete) {
        percentComplete = fn(percentComplete);
        return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
    };
}

AnimationTimer.makeLinear = function () {
    return function (percentComplete) {
        return percentComplete;
    }
}