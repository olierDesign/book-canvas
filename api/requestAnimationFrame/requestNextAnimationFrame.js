window.requestNextAnimationFrame = (function() {
    var originalWebkitMethod,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // 修复：chrome 10 版本的浏览器中运行，animate()函数被回调时，所传入的 time 参数是 undefined
    if (window.webkitRequestAnimationFrame) {
        wrapper = function(time) {
            if (time === undefined) {
                time = +new Date();
            }

            self.callback(time);
        }

        originalWebkitMethod = window.webkitRequestAnimationFrame;
        window.requestAnimationFrame = function(callback, element) {
            self.callback = callback;

            originalWebkitMethod(wrapper, element)
        }
    }

    // 修复：Firefox 4.0 的帧速率局限在每秒 30～40
    if (window.mozRequestAnimationFrame) {
        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != '-1') {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            var start,
                finish;

            window.setTimeout(function() {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);
            }, self.timeout);
        }
})()