
const fs = require('fs');
const cocotbfile = require('../../src/editor/cocotb');

var structure = fs.readFileSync('examples/vhdl/structure.json','utf8');
structure_vhdl     = JSON.parse(structure);
var structure = fs.readFileSync('examples/verilog/structure.json','utf8');
structure_v     = JSON.parse(structure);

var cocotbpyVhdl = new cocotbfile.cocotb(structure_vhdl);
var cocotbpyV = new cocotbfile.cocotb(structure_v);

console.log(cocotbpyVhdl.generate());
console.log(cocotbpyV.generate());

fs.writeFile("./cocotbVhdl.py", cocotbpyVhdl.generate(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
fs.writeFile("./cocotbV.py", cocotbpyV.generate(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
