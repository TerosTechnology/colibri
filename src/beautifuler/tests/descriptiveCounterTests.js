"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const descriptiveCounter_1 = require("../descriptiveCounter");
const assert_1 = require("./assert");
let testCount = 0;
var showUnitTests = true; //window.location.href.indexOf("http") < 0;
function testDescriptiveCounter() {
    if (showUnitTests) {
        testCount = 0;
        start();
        console.log("total tests: " + testCount);
    }
}
exports.testDescriptiveCounter = testDescriptiveCounter;
function start() {
    console.log("=== descriptiveCounter ===");
    test(descriptiveCounter_1.descriptiveCounter, "one blankspace", " ", "one blankspace");
    test(descriptiveCounter_1.descriptiveCounter, "mixed chars", " A ", "one blankspace & one 'A' & one blankspace");
    test(descriptiveCounter_1.descriptiveCounter, "4 blankspaces", "    ", "four blankspaces");
    test(descriptiveCounter_1.descriptiveCounter, "9 blankspaces", "         ", "many blankspaces");
    test(descriptiveCounter_1.descriptiveCounter, "2 As", "AA", "two 'A's");
}
function test(func, testName, inputs, expected) {
    let actual = func(inputs);
    assert_1.assert(testName, expected, actual);
    testCount++;
}
//# sourceMappingURL=descriptiveCounterTests.js.map