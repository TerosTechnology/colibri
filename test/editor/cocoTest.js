
const fs = require('fs');
const cocotbfile = require('../../src/editor/cocotb');

var structure = fs.readFileSync('../examples/vhdl/example_1.json','utf8');
structure     = JSON.parse(structure);

var cocotbpy = new cocotbfile.cocotb(structure);

console.log(cocotbpy.generate());

fs.writeFile("./cocotb.py", cocotbpy.generate(), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
