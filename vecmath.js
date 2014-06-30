var VecMath = VecMath ? VecMath : {};

(function () {

    // Privates. Requires "this" binding in order to be successfully invoked.
    var addVector2 = function (vector) {
        return createNewVector2(this.x + vector.x, this.y + vector.y);
    };

    var subVector2 = function (vector) {
        return createNewVector2(this.x - vector.x, this.y - vector.y);
    };

    var multScalarVector2 = function (scalar) {
        return createNewVector2(this.x * scalar, this.y * scalar);
    };

    var divScalarVector2 = function (scalar) {
        if (scalar === 0) {
            return "NaN";
        } else {
            return createNewVector2(this.x / scalar, this.y / scalar);
        }
    };

    var dotVector2 = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };

    var magnitudeVector2 = function (x, y) {
        var accumulator = x * x + y * y;
        
        return Math.sqrt(accumulator);
    };

    var reflect = function (mirror) {
        // R = 2 * (V dot N) * N - V
        return mirror.mult(2 * this.dot(mirror)).sub(this);
    };

    // Constructor for vectors. Defines vector operations.
    var createNewVector2 = function (x, y) {
        var newObj = {
            // Properties
            x: x,
            y: y,
            magnitude: magnitudeVector2(x, y),

            // Functions
            add: addVector2,
            sub: subVector2,
            mult: multScalarVector2,
            div: divScalarVector2,
            dot: dotVector2,
            reflect: reflect
        };

        // Ensure proper "this" context when invoking.
        newObj.add.bind(newObj);
        newObj.sub.bind(newObj);
        newObj.mult.bind(newObj);
        newObj.div.bind(newObj);
        newObj.dot.bind(newObj);
        newObj.reflect.bind(newObj);

        return newObj;
    };

    // Vector Math
    VecMath.vector2 = function (x, y) {
        return createNewVector2(x, y);
    };
    
    VecMath.pointToLineVector = function (lineStart, lineEnd, point) {
        // TODO: Refactor into to a line segment, a ray, and infinite line (maybe). 

        // The distance between a point to a line is the magnitude of this vector:
        // (p - a) - ((p - a) dot n)n, where:
        //      a is lineStart
        //      p is point
        //      n is the unit vector direction of the line segment
        var lineSegmentVector = lineEnd.sub(lineStart); 
        var lineDirection = lineSegmentVector.div(lineSegmentVector.magnitude);

        // (p - a)
        var lineStartToPoint = point.sub(lineStart);

        VecDraw.drawRay(lineStart, lineStartToPoint);

        var projectOnNormMagnitude = lineStartToPoint.dot(lineDirection);

        // When the magnitude is less than 0, we're actually outside
        // the bounds of the line segment. Snap to the origin of the line.
        if (projectOnNormMagnitude <= 0) {
            return lineStart.sub(point);
        }

        // We've gone further than the line segment's end. Clamp to the value closest to 0.
        projectOnNormMagnitude = Math.min(lineSegmentVector.magnitude, projectOnNormMagnitude);

        var projectOnNormVector = lineDirection.mult(projectOnNormMagnitude);
        VecDraw.drawRay(lineStart, projectOnNormVector, "red");

        var pointToNorm = projectOnNormVector.sub(lineStartToPoint);

        return pointToNorm;
    };

})();
