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
        // TODO: Refactor into to a line segment, a ray, and infinite line (maybe). 

        // The distance between a point to a line is the magnitude of this vector:
        // (a - p) - ((a - p) dot n)n, where:
        //      a is lineStart
        //      p is point
        //      n is the unit vector direction of the line segment
        var lineSegmentVector = VecMath.subVector2(lineEnd, lineStart);
        var norm = VecMath.scalarDivideVector2(VecMath.magnitude(lineSegmentVector), lineSegmentVector);

        // (a - p)
        var pointToOrigin = VecMath.subVector2(point, lineStart);

        VecDraw.drawRay(lineStart, pointToOrigin);

        var projectOnNormMagnitude = VecMath.dot(pointToOrigin, norm);

        // Ugh. When the magnitude is greater than 0, we're actually outside
        // the bounds of the line segment. Snap to the origin of the line.
        if (projectOnNormMagnitude <= 0) {
            return VecMath.subVector2(lineStart, point);
        }

        // We've gone further than the line segment's end. Clamp to the value closest to 0.
        projectOnNormMagnitude = Math.min(VecMath.magnitude(lineSegmentVector), projectOnNormMagnitude);

        var projectOnNormVector = VecMath.scalarMultVector2(-1 * projectOnNormMagnitude, norm);
        VecDraw.drawRay(lineEnd, projectOnNormVector, "red");

        var pointToNorm = VecMath.subVector2(VecMath.scalarMultVector2(-1, pointToOrigin), projectOnNormVector);

        return pointToNorm;
    };
    
    VecMath.reflect = function (vector, mirror) {
        // R = 2 * (V dot N) * N - V
        var proj = VecMath.scalarMultVector2(2 * VecMath.dot(vector, mirror), mirror);
        return VecMath.subVector2(proj, vector);
    };
    
})();
