var VecDraw = VecDraw ? VecDraw : {};

(function () {
    
    var canvas = null;
    var context = null;
    
    VecDraw.initialize = function (canvas) {
        VecDraw.setCanvas(canvas);
    };
    
    VecDraw.setCanvas = function (curCanvas) {
        canvas = curCanvas;
        context = canvas.getContext("2d");
    };
    
    // Vector drawing functions
    VecDraw.drawLine = function (startPos, endPos, color) {
        context.beginPath();
        context.lineWidth = 1;
        context.lineStyle = color ? color : "grey";
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.stroke();
    };
    
    VecDraw.drawRay = function (startPos, vector, color) {
        context.beginPath();
        context.lineWidth = 1;
        context.lineStyle = color ? color : "grey";
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(startPos.x + vector.x, startPos.y + vector.y);
        context.stroke();
    };

})();