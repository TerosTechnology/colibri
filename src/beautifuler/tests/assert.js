"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assert(testName, expected, actual, message) {
    var result = CompareString(actual, expected);
    if (result != true) {
        console.log('"' + testName + "\" failed: \n" + result);
    }
    else {
        //console.log(testName + " pass");
    }
}
exports.assert = assert;
function CompareString(actual, expected) {
    var l = Math.min(actual.length, expected.length);
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            var toEnd = Math.min(i + 50, l);
            return '\ndifferent at ' + i.toString() +
                '\nactual: "\n' + actual.substring(i, toEnd) +
                '\nexpected: "\n' + expected.substring(i, toEnd) + '"\n---' +
                "\nactual (full): \n" + actual + "\n---" +
                "\nexpected (full): \n" + expected + "\n====\n";
        }
    }
    if (actual != expected) {
        return 'actual: \n"' + actual + '"\nexpected: \n"' + expected + '"';
    }
    return true;
}
exports.CompareString = CompareString;
//# sourceMappingURL=assert.js.map