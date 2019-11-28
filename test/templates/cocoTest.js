const fs = require('fs');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('examples/vhdl/structure.json','utf8');
var structure_vhdl     = JSON.parse(structure);
var structure = fs.readFileSync('examples/verilog/structure.json','utf8');
var structure_v     = JSON.parse(structure);

var cocotbpyVhdl = new Colibri.Templates.Templates();
var cocotbpyV = new Colibri.Templates.Templates();

fs.writeFile("./cocotbVhdl.py", cocotbpyVhdl.getCocotbTemplate(structure_vhdl), function(err) {
    if(err) {
        return console.log(err);
        throw new Error('Test error.');
    }
    else
      console.log("---> Tested: cocotb vhdl");
});
fs.writeFile("./cocotbV.py", cocotbpyV.getCocotbTemplate(structure_v), function(err) {
    if(err) {
        return console.log(err);
        throw new Error('Test error.');
    }
    else
      console.log("---> Tested: cocotb verilog");
});
