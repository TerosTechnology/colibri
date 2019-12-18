const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

let options = {
  'type' : "normal",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'structure.json','utf8');
structure     = JSON.parse(structure);
var testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdl.vhd','utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getVHDLTestbench(structure, options);

console.log('****************************************************************');
if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') === test.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
  console.log("Testing... tbVhdl: Ok!");
}
else{
  console.log("Testing... tbVhdl: Fail!");
  throw new Error('Test error.');
}
////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit";
testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdlVunit.vhd','utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getVHDLTestbench(structure, options)

if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === test.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
  console.log("Testing... tbVhdlVunit: Ok!");
}
else{
  console.log("Testing... tbVhdlVunit: Fail!");
  throw new Error('Test error.');
}
console.log('****************************************************************');
