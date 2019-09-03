const fs = require('fs');
const codes = require('../../src/db/codes')
const db_manager = require('../../src/db/db_manager')
const EditorFactory = require('../../src/editor/factory')

db_manager.setActiveStandardCode(codes.Standards.VHDL2008);
db_manager.setActiveEditorCode(codes.Editors.VHDL);

let options = {
  'type' : "normal",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('./examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);
var testExpected = fs.readFileSync('./examples/vhdl/tbVhdl.vhd','utf8');
var test = EditorFactory.getConfiguredEditor().createTestbench(structure, options);

console.log('****************************************************************');
if(testExpected.replace(/\n/g,'').replace(/ /g,'') === test.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... tbVhdl: Ok!");
}
else{
  console.log("Testing... tbVhdl: Fail!");
}
////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit";
testExpected = fs.readFileSync('./examples/vhdl/tbVhdlVunit.vhd','utf8');
test = EditorFactory.getConfiguredEditor().createTestbench(structure, options);if(testExpected.replace(/\n/g,'').replace(/ /g,'') === test.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... tbVhdlVunit: Ok!");
}
else{
  console.log("Testing... tbVhdlVunit: Fail!");
}
console.log('****************************************************************');
