const ParserFactory = require("../../src/parser/factory")
const LinterFactory = require("../../src/linter/factory")

console.log(ParserFactory.getConfiguredParser());
console.log(LinterFactory.getConfiguredLinter());
