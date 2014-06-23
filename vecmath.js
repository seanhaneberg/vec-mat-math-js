var VecMath = VecMath ? VecMath : {};

(function () {

    // Vector Math
    VecMath.vector2 = function (x, y) {
        return {x: x, y: y};
    };

    VecMath.addVector2 = function (a, b) {
        return {x: a.x + b.x, y: a.y + b.y};
    };

    VecMath.subVector2 = function (a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    };

    VecMath.scalarMultVector2 = function (scalar, vector) {
        return {x: vector.x * scalar, y: vector.y * scalar};
    };

    VecMath.scalarDivideVector2 = function (scalar, vector) {
        if (scalar == 0) {
            // Legit?
            return "NaN";
        } else {
            return {x: vector.x / scalar, y: vector.y / scalar};
        }
    };

    VecMath.dot = function (a, b) {
        return a.x * b.x + a.y * b.y;
    };
    
    VecMath.magnitude = function (vector) {
        var accumulator = 0;
        
        for (var curDim in vector) {
            accumulator += vector[curDim] * vector[curDim];
        }
        
        return Math.sqrt(accumulator);
    };
    
    VecMath.pointToLineVector = function (lineStart, lineEnd, point) {
        // The distance between a point to a line is the magnitude of this vector:
        // (a - p) - ((a - p) dot n)n, where:
        //      a is lineStart
        //      p is point
        //      n is the unit vector direction of the line segment
        var lineSegmentVector = VecMath.subVector2(lineEnd, lineStart);
        var norm = VecMath.scalarDivideVector2(VecMath.magnitude(lineSegmentVector), lineSegmentVector);
        
        // (a - p)
        var originToPoint = VecMath.subVector2(lineStart, point);
        var projectOnNormMagnitude = VecMath.dot(originToPoint, norm);
        var projectOnNormVector = VecMath.scalarMultVector2(projectOnNormMagnitude, norm);
        var pointToNorm = VecMath.subVector2(originToPoint, projectOnNormVector);
        return pointToNorm;
    };
    
    VecMath.reflect = function (vector, mirror) {
        // R = 2 * (V dot N) * N - V
        var proj = VecMath.scalarMultVector2(2 * VecMath.dot(vector, mirror), mirror);
        return VecMath.subVector2(proj, vector);
    };
    
})();
