const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'runpyConf.json','utf8');
structure     = JSON.parse(structure);

var runpy = new Colibri.Templates.Templates();

fs.writeFile("runGen.py", runpy.getVUnitTemplate(structure), function(err) {
    if(err) {
      throw new Error('Test error.');
    }
    else
      console.log("---> Tested: runpy generator");

var file = fs.readFileSync('run.py','utf8');
var fileGen = fs.readFileSync('runGen.py','utf8');
if(file.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '').replace("\\","\\\\") != fileGen.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '').replace("\\","\\\\")){
    throw new Error('Template error.');
}
else
  console.log("---> Tested: runpy template");

});
