var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');
    FONT_HEIGHT = 15,
    MARGIN = 35,
    HAND_TRUNCATION = canvas.width / 25,
    HOUR_HAND_TRUNCATION = canvas.width / 10,
    NUMERAL_SPACING = 20,
    RADIUS = canvas.width / 2 - MARGIN,
    HAND_RADIUS = RADIUS + NUMERAL_SPACING;

    function drawCircle() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
    }

    function drawNumerals() {
        var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            angle = 0,
            numeralWidth = 0;
        
        numerals.forEach(function(numeral){
            // Math.PI / 6 * (numeral - 3)
            // 每个时刻占 (Math.PI / 6 ) 分圆，由于计算是从 0 度开始，而时钟从 -90 度开始
            angle = Math.PI / 6 * (numeral - 3);
            numeralWidth = context.measureText(numeral).width;

            context.fillText(numeral,
                canvas.width / 2 + Math.cos(angle) * HAND_RADIUS - numeralWidth / 2,
                canvas.height / 2 + Math.sin(angle) * HAND_RADIUS + FONT_HEIGHT / 3
            );
        });
    }

    function drawCenter() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI, true);
        context.fill();
    }

    function drawHand(loc, isHour) {
        // 1、 2 * Math.PI * (loc / 60) : 计算出几分之圆，再乘以弧度
        // - Math.PI / 2，由于计算是从 0 度开始，而时钟从 -90 度开始
        var angle = 2 * Math.PI * (loc / 60) - Math.PI / 2,
            handRadius = isHour ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION : RADIUS - HAND_TRUNCATION;

        context.moveTo(canvas.width / 2, canvas.height / 2);
        context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius, canvas.height / 2 + Math.sin(angle) * handRadius);
        context.stroke();
    }

    function drawHands() {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        hours = hours > 12 ? hours - 12 : hours;

        drawHand(hours * 5 + (minutes / 60) * 5, true, 0.5);
        drawHand(minutes, false, 0.5);
        drawHand(seconds, false, 0.2)
    }

    // 以图像方式实现
    var snapshotImageElement = document.getElementById('snapshotImageElement');
    function updateClockImage() {
        snapshotImageElement.src = canvas.toDataUrl()
    }

    function drowClock() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle();
        drawCenter();
        drawHands();
        drawNumerals();

        updateClockImage();
    }

    context.font = `${FONT_HEIGHT}px Arial`;
    loop = setInterval(drowClock, 1000);