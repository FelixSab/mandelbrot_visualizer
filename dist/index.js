function times(times, fn) {
    for (var i = 0; i < times; i++) {
        fn(i);
    }
}
var grid = document.getElementById('grid');
times(10000, function () { return grid.appendChild(document.createElement('div')); });
var violett = [255, 0, 255];
var blue = [0, 0, 255];
var türkis = [0, 255, 255];
var grün = [0, 255, 0];
var gelb = [255, 255, 0];
var rot = [255, 0, 0];
var colors = [
    violett,
    blue,
    türkis,
    grün,
    gelb,
    rot
];
var rgbdiff = 255 * 5;
function getRGBFromPercentage(percentage) {
    var stepsAmount = Math.floor(percentage * rgbdiff);
    var breakpointsHit = Math.floor(stepsAmount / 255);
    var stepsAfterBreakpoint = stepsAmount % 255;
    var _a = colors[breakpointsHit], r = _a[0], g = _a[1], b = _a[2];
    switch (breakpointsHit) {
        case 0: return [r - stepsAfterBreakpoint, g, b];
        case 1: return [r, g + stepsAfterBreakpoint, b];
        case 2: return [r, g, b - stepsAfterBreakpoint];
        case 3: return [r + stepsAfterBreakpoint, g, b];
        case 4: return [r, g - stepsAfterBreakpoint, b];
        case 5: return [r, g, b + stepsAfterBreakpoint];
    }
}
function add() {
    var cs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        cs[_i] = arguments[_i];
    }
    return cs.reduce(function (prev, curr) { return ({
        r: prev.r + curr.r,
        i: prev.i + curr.i
    }); });
}
function square(c) {
    var a2 = { r: Math.pow(c.r, 2), i: 0 };
    var ab = { r: 0, i: c.r * c.i * 2 };
    var b2 = { r: Math.pow(c.i, 2) * -1, i: 0 };
    return add(a2, ab, b2);
}
function mandelbrot(t) {
    var fn = function (depth, c, curr) {
        if (curr === void 0) { curr = { r: 0, i: 0 }; }
        if (curr.r >= 2 || curr.r <= -2)
            return depth;
        if (depth === rgbdiff)
            return depth;
        return fn(depth + 1, c, add(square(curr), c));
    };
    var erg = fn(0, t);
    return erg;
}
var children = grid.children;
times(children.length, function (i) {
    var child = children[i];
    var x = i % 100;
    var y = Math.floor(i / 100);
    var val = mandelbrot({ r: ((x / 100) * 2) - 1.5, i: ((y / 100) * 2) - 1 });
    var _a = getRGBFromPercentage(val / rgbdiff), r = _a[0], g = _a[1], b = _a[2];
    var color = "rgb(" + r + ", " + g + ", " + b + ")";
    child.setAttribute('style', "background-color: " + color);
});
