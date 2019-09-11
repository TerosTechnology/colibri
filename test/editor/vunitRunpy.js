
const fs = require('fs');
const runpyfile = require('../../src/editor/vunit');

var structure = fs.readFileSync('./examples/vhdl/runpyConf.json','utf8');
structure     = JSON.parse(structure);

var runpy = new runpyfile.runpy(structure);

// runpy.generate();
console.log(runpy.generate());
