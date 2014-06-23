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

    // Return a collection of lines.
    // TODO: Move to a vert index buffer model.
    var linesFromVerts = function (verts) {
        var lines = [];
        
        for (var i = 0; i < verts.length; i++) {
            var lineFrom = verts[i];
            var lineTo = null;
            if (i + 1 >= verts.length) {
                lineTo = verts[0];
            } else {
                lineTo = verts[i + 1];
            }
            
            lines[lines.length] = {start: lineFrom, end: lineTo};
        }

        return lines;
    };
    
    var updateBall = function () {
        var delta = deltaTime();

        var playAreaLines = linesFromVerts(playArea);

        // Check all boundaries
        for (var i = 0; i < playAreaLines.length; i++) {
            var pointToLine = VecMath.pointToLineVector(playAreaLines[i].start, playAreaLines[i].end, ball.position);
            var distance = VecMath.magnitude(pointToLine);
            
            var facingLine = VecMath.dot(pointToLine, ball.velocity);
            
            if (distance <= ball.radius && facingLine > 0) {
                // R = 2 * (V dot N) * N - V
                var pointToLineUnit = VecMath.scalarDivideVector2(distance, pointToLine);
                var vDotN = 2 * VecMath.dot(ball.velocity, pointToLineUnit);
                var normalProj = VecMath.scalarMultVector2(vDotN, pointToLineUnit);
                var reflection = VecMath.subVector2(normalProj, ball.velocity);
                ball.velocity = VecMath.scalarMultVector2(-1 * bounceReduce, reflection);
            }
        }
        
        // TODO: Remove
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
        var lines = linesFromVerts(playArea);
        for (var i = 0; i < lines .length; i++) {
            VecDraw.drawLine(lines[i].start, lines[i].end);
        }
    };
    
    var drawDebugInfo = function () {
        var velocityExaggeration = 400;
        VecDraw.drawRay(ball.position, VecMath.scalarMultVector2(velocityExaggeration, ball.velocity), "blue", 3);
        drawBallToPlayArea();
    };
    
    var drawBallToPlayArea = function () {
        var lines = linesFromVerts(playArea);
        for (var i = 0; i < playArea.length; i++) {
            drawPointToLine(lines[i].start, lines[i].end, ball.position);
        }
    };
    
    var drawPointToLine = function (lineStart, lineEnd, point) {
        var pointToLine = VecMath.pointToLineVector(lineStart, lineEnd, point);
        VecDraw.drawRay(point, pointToLine, "blue", 3);
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