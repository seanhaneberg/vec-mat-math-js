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

})();
