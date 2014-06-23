// canvasTemplate.js

(function () {

    // Simulation Globals

    var intervalId = null;
    var context = null;
    var lastInvoke = null;
    var canvas = null;
    var bounceReduce = 0.8;
    var debugData = true;
    
    var globalSettings = {
        width: 640,
        height: 480,
        updateInterval: 10 // 10 ms
    };

    var ball = {
        position: VecMath.vector2(70, 80),
        velocity: VecMath.vector2(0.1, 0.1),
        radius: 10
    };

    // An arbitrarily and irregularly-shaped pen.
    var playArea = [
        VecMath.vector2(40, 50),
        VecMath.vector2(500, 40),
        VecMath.vector2(485, 300),
        VecMath.vector2(60, 320)
    ];

    var main = function () {
        canvas = document.getElementById("myCanvas");
        canvas.height = globalSettings.height;
        canvas.width = globalSettings.width;
        
        // Initialize VecDraw
        VecDraw.initialize(canvas);
        
        context = canvas.getContext("2d");
        lastInvoke = new Date();
        intervalId = setInterval(loop, globalSettings.updateInterval);
    };

    var deltaTime = function () {
        var delta = new Date() - lastInvoke;
        lastInvoke = new Date();
        return delta;
    };

    var updateBall = function () {
        var delta = deltaTime();

        if ((ball.position.x + 10 >= canvas.width && ball.velocity.x > 0)|| (ball.position.x <= 0 && ball.velocity.x < 0))
        {
            ball.velocity.x = -ball.velocity.x * bounceReduce;
        }

        if ((ball.position.y + 10 >= canvas.height && ball.velocity.y > 0) || (ball.position.y <= 0 && ball.velocity.y < 0))
        {
            ball.velocity.y = -ball.velocity.y * bounceReduce;
        }

        var movementVector = VecMath.scalarMultVector2(delta, ball.velocity);
        ball.position = VecMath.addVector2(ball.position, movementVector);
    };
    
    var update = function () {
        updateBall();
    };
    
    var drawBall = function () {
        context.beginPath();
        context.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "grey";
        context.stroke();
    };
    
    var drawPlayArea = function () {

        for (var i = 0; i < playArea.length; i++) {
            var lineFrom = playArea[i];
            var lineTo = null;
            
            // Look ahead. If we're at the end, close the loop.
            if (i + 1 >= playArea.length) {
                lineTo = playArea[0];
            } else {
                lineTo = playArea[i + 1];
            }

            VecDraw.drawLine(lineFrom, lineTo);
        }
    };
    
    var drawDebugInfo = function () {
        var velocityExaggeration = 400;
        VecDraw.drawRay(ball.position, VecMath.scalarMultVector2(velocityExaggeration, ball.velocity), "blue", 3);
        drawBallToPlayAreaBounds();
    };
    
    var drawBallToPlayAreaBounds = function () {
        for (var i = 0; i < playArea.length; i++) {
            var lineFrom = playArea[i];
            var lineTo = null;
            
            if (i + 1 >= playArea.length) {
                lineTo = playArea[0];
            } else {
                lineTo = playArea[i + 1];
            }

            drawPointToLine(lineFrom, lineTo, ball.position);
        }
        
    
    };
    
    var drawPointToLine = function (lineStart, lineEnd, point) {
        var pointToNorm = VecMath.pointToLineVector(lineStart, lineEnd, point);
        VecDraw.drawRay(point, pointToNorm, "blue", 3);
    };
    
    var draw = function () {
        // Clear the entire canvas.
        context.clearRect(0, 0, globalSettings.width, globalSettings.height);
        drawPlayArea();
        drawBall();
        
        if (debugData) {
            drawDebugInfo();
        }
    };
    
    var loop = function () {
        update();
        draw();
    };

    main();

})();