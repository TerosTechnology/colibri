const fs = require('fs');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('./examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);
var documenter = new Colibri.Documenter.BaseStructure(structure);
var mdDocOut   = documenter.getMdDoc();
var mdDocExp   = fs.readFileSync('./examples/vhdl/md.md','utf8');
if(mdDocExp.replace(/\n/g,'').replace(/ /g,'') === mdDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.markdown] Ok!");
}
else{
  console.log("Testing... [Documentation.markdown] Fail!");
  throw new Error('Test error.');
}
console.log('****************************************************************');
////////////////////////////////////////////////////////////////////////////////
var htmlDocOut = documenter.getHtmlDoc();
var htmlDocExp = fs.readFileSync('./examples/vhdl/html.html','utf8');
if(htmlDocExp.replace(/\n/g,'').replace(/ /g,'') === htmlDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.html] Ok!");
}
else{
  console.log("Testing... [Documentation.html] Fail!");
  throw new Error('Test error.');
}
