const fs = require('fs');
const codes = require('../../src/db/codes')
const db_manager = require('../../src/db/db_manager')
const EditorFactory = require('../../src/editor/factory')

db_manager.setActiveStandardCode(codes.Standards.VERILOG2001);
db_manager.setActiveEditorCode(codes.Editors.VERILOG);

let options = {
  'type': "normal",
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
var test = EditorFactory.getConfiguredEditor().createTestbench(structure, options);

console.log('****************************************************************');
if (testExpected.replace(/\n/g, '').replace(/ /g, '') === test.replace(/\n/g, '').replace(/ /g, '')) {
  console.log("Testing... tbVerilog 2001: Ok!");
} else {
  console.log("Testing... tbVerilog 2001: Fail!");
}
////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit"
testExpected = fs.readFileSync('./examples/verilog/tbVerilogVunit2001.v', 'utf8');

test = EditorFactory.getConfiguredEditor().createTestbench(structure, options);
if (testExpected.replace(/\n/g, '').replace(/ /g, '') === test.replace(/\n/g, '').replace(/ /g, '')) {
  console.log("Testing... tbVerilogVunit 2001: Ok!");
} else {
  console.log("Testing... tbVerilogVunit 2001: Fail!");
}
console.log('****************************************************************');
