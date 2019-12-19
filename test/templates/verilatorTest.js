const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'structure.json','utf8');
structure_v     = JSON.parse(structure);

var veritest = new Colibri.Templates.Templates();

fs.writeFile("veritest.cpp", veritest.getVerilatorTemplate(structure_v), function(err) {
    if(err) {
      throw new Error('Test error.');
    }
    else
      console.log("---> Tested: verilator");
});
