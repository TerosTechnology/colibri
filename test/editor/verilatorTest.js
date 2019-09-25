
const fs = require('fs');
const verilatorfile = require('../../src/editor/verilator');

var structure = fs.readFileSync('examples/verilog/structure.json','utf8');
structure_v     = JSON.parse(structure);

var veritest = new verilatorfile.verilator(structure_v);

console.log(veritest.generate());

fs.writeFile("./veritest.cpp", veritest.generate(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
