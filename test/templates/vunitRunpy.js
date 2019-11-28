const fs = require('fs');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('./examples/vhdl/runpyConf.json','utf8');
structure     = JSON.parse(structure);

var runpy = new Colibri.Templates.Templates();

fs.writeFile("./run.py", runpy.getVUnitTemplate(structure), function(err) {
    if(err) {
      throw new Error('Test error.');
    }
    else
      console.log("---> Tested: runpy");
});
