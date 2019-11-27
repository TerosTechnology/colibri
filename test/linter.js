const fs = require('fs');
const Colibri = require('../src/main');
const Linter = Colibri.Linter;

let finalResult = true;

var vhdl_simulators = [Linter.SIMULATORS.GHDL];
for (let i = 0; i < vhdl_simulators.length; ++i) {
  let linter = new Linter.LinterFactory(vhdl_simulators[i]);
  for (let x = 0; x < 5; ++x) {
    let file = "./examples/vhdl_error/example_" + x + ".vhd"
    let errors_result = linter.lint(file);
    let errors_exp = fs.readFileSync('./examples/vhdl_error/example_' + x + '.json', 'utf8');
    errors_exp = JSON.parse(errors_exp);
    let result = compare(errors_result, errors_exp[vhdl_simulators[i].toUpperCase()]);

    console.log("Testing... Simulator: [" + vhdl_simulators[i] + "] || File: " +
      "example_" + x + ".vhdl || Result: " + result);
    if (result == false)
      finalResult = false;
  }
}

var verilog_simulators = [Linter.SIMULATORS.ICARUS,Linter.SIMULATORS.VERILATOR];
for (let i = 0; i < verilog_simulators.length; ++i) {
  let linter = new Linter.LinterFactory(verilog_simulators[i]);
  for (let x = 0; x < 5; ++x) {
    let file = "./examples/verilog_error/example_" + x + ".v"
    let errors_result = linter.lint(file);
    let errors_exp = fs.readFileSync('./examples/verilog_error/example_' + x + '.json', 'utf8');
    errors_exp = JSON.parse(errors_exp);
    let result = compare(errors_result, errors_exp[verilog_simulators[i].toUpperCase()]);

    console.log("Testing... Simulator: [" + verilog_simulators[i] + "] || File: " +
      "example_" + x + ".v || Result: " + result);
    if (result == false)
      finalResult = false;
  }
}

if (finalResult == false)
  throw new Error('Test error.');



function compare(m, n) {
  if (m.length != n.length) {
    console.log("*************************************************************")
    console.log("Fail: length");
    console.log("Real ----->");
    console.log(m);
    console.log("Expected ----->");
    console.log(n);
    console.log("*************************************************************")
    return false;
  }
  var insp = ['severity', 'description'];
  for (let i = 0; i < m.length; ++i) {
    for (let x = 0; x < insp.length; ++x) {
      if (m[i][insp[x]] != n[i][insp[x]]) {
        console.log("*************************************************************")
        console.log("Fail: " + insp[x]);
        console.log("Real ----->");
        console.log(m[i]);
        console.log("Expected ----->");
        console.log(n[i]);
        console.log("*************************************************************")
        return false;
      }
    }
  }
  for (let i = 0; i < m.length; ++i) {
    if (m[i]['location']['position'][0] != n[i]['location']['position'][0] &&
      m[i]['location']['position'][0] != n[i]['location']['position'][0]) {
      console.log("*************************************************************")
      console.log("Fail: location,position");
      console.log("Real ----->");
      console.log(m[i]);
      console.log("Expected ----->");
      console.log(n[i]);
      console.log("*************************************************************")
      return false;
    }
  }
  return true;
}
