const fs = require('fs');
const Colibri = require('../../src/main');

let options = {
  'type': "normal",
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters': [{
      'parameter': "X"
    },
    {
      'parameter': "Y"
    }
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('./examples/verilog/structure.json', 'utf8');
structure = JSON.parse(structure);
var testExpected = fs.readFileSync('./examples/verilog/tbVerilog2001.v', 'utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getVerilogTestbench(structure, options);

console.log('****************************************************************');
if (testExpected.replace(/\n/g, '').replace(/ /g, '') === test.replace(/\n/g, '').replace(/ /g, '')) {
  console.log("Testing... tbVerilog 2001: Ok!");
} else {
  console.log("Testing... tbVerilog 2001: Fail!");
  throw new Error('Test error.');
}
////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit"
testExpected = fs.readFileSync('./examples/verilog/tbVerilogVunit2001.v', 'utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getVerilogTestbench(structure, options);

if (testExpected.replace(/\n/g, '').replace(/ /g, '') === test.replace(/\n/g, '').replace(/ /g, '')) {
  console.log("Testing... tbVerilogVunit 2001: Ok!");
} else {
  console.log("Testing... tbVerilogVunit 2001: Fail!");
  throw new Error('Test error.');
}
console.log('****************************************************************');
