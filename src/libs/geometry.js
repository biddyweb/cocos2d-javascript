var sys = require('sys');

/** @namespace */
var geometry = {
    /**
     * Creates a Point instance
     *
     * @param {Number} x X coordinate
     * @param {Number} y Y coordinate
     */
    ccp: function(x, y) {
        return module.exports.pointMake(x, y);
    },

    PointZero: function() {
        return ccp(0,0);
    },

    rectMake: function(x, y, w, h) {
        return {origin: module.exports.pointMake(x, y), size: module.exports.sizeMake(w, h)};
    },

    sizeMake: function(w, h) {
        return {width: w, height: h};
    },

    pointMake: function(x, y) {
        return {x: x, y: y};
    },

    rectContainsPoint: function(r, p) {
        return ((p.x >= r.origin.x && p.x <= r.origin.x + r.size.width)
                && (p.y >= r.origin.y && p.y <= r.origin.y + r.size.height));
    },

    pointEqualToPoint: function(point1, point2) {
        return (point1.x == point2.x && point1.y == point2.y);
    },

    pointApplyAffineTransform: function(p, trans) {
        var newPoint = ccp(0, 0);
        
        newPoint.x = p.x * trans[0][0] + p.y * trans[1][0] + trans[2][0];
        newPoint.y = p.x * trans[0][1] + p.y * trans[1][1] + trans[2][1];

        return newPoint;
    },
    affineTransformDeterminant: function(trans) {
        var det = 1,
            t = sys.copy(trans);

        var k, i, j, q, tkk;
        for (k = 0; k < 3; k++) {
            tkk = t[k][k];

            if (tkk == 0) {
                i = k;
                while (t[i][k] == 0) {
                    if (i++ > 3) {
                        return 0;
                    }
                }

                // Swap t[i] and t[k]
                t[i] = t[i] + t[k]; t[k] = t[i] - t[k]; t[i] = t[i] - t[k];

                tkk = t[k][k];

                det *= -1;
            }

            for (i = k+1; i < 3; i++) {
                q = t[i][k] / tkk;
                for (j = k+1; j < 3; j++) {
                    t[i][j] -= t[k][j] * q
                }
            }

            det *= tkk;
        }

        return det;
    },
    affineTransformInvert: function(trans) {
        var newTrans = module.exports.affineTransformIdentity();

        var t = sys.copy(trans);

        var k, i, j, q, tkk;
        for (k = 0; k < 3; k++) {
            tkk = t[k][k];

            if (tkk == 0) {
                i = k;
                do {
                    if (i++ > 3) {
                        throw "Matrix not regular size";
                    }
                } while (t[i][k] == 0);

                // Swap t[i] and t[k]
                t[i] = t[i] + t[k];
                t[k] = t[i] - t[k];
                t[i] = t[i] - t[k];
                newTrans[i] = newTrans[i] + newTrans[k];
                newTrans[k] = newTrans[i] - newTrans[k];
                newTrans[i] = newTrans[i] - newTrans[k];

                tkk = t[k][k];
            }

            for (i = 0; i < 3; i++) {
                if (i == k) {
                    continue
                }

                q = t[i][k] / tkk;
                t[i][k] = 0;

                for (j = k+1; j < 3; j++) {
                    t[i][j] -= t[k][j] * q;
                }
                for (j = 0; j < 3; j++) {
                    newTrans[i][j] -= newTrans[k][j] * q;
                }
            }

            for (j = k+1; j < 3; j++) {
                t[k][j] /= tkk;
            }
            for (j = 0; j < 3; j++) {
                newTrans[k][j] /= tkk;
            }

        }

        return newTrans;
       
    },

    /**
     * Multiply 2 transform (3x3) matrices together
     */
    affineTransformConcat: function(trans1, trans2) {
        var newTrans = module.exports.affineTransformIdentity();

        var x, y, i;
        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                newTrans[y][x] = 0;
                for (i = 0; i < 3; i++) {
                    newTrans[y][x] += trans1[y][i] * trans2[i][x];
                }
            }
        }

        return newTrans;
    },

    degressToRadians: function(angle) {
        return angle / 180.0 * Math.PI;
    },
    affineTransformTranslate: function(trans, x, y) {
        // tx = 6, ty = 7

        var newTrans = sys.copy(trans);
        newTrans[2][0] += x;
        newTrans[2][1] += y;

        return newTrans;
    },

    affineTransformRotate: function(trans, angle) {
        // TODO
        return trans;
    },

    affineTransformScale: function(trans, scale) {
        // TODO
        return trans;
    },

    affineTransformIdentity: function() {
        return [[1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]];
    }
};

module.exports = geometry;