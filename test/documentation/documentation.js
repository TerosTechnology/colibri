const fs = require('fs');
const codes = require('../../src/db/codes')
const db_manager = require('../../src/db/db_manager')
const DocumenterFactory = require('../../src/documenter/factory')

db_manager.setActiveStandardCode(codes.Standards.VHDL2008);
db_manager.setActiveDocumenterCode(codes.Documenters.VHDL);

var structure = fs.readFileSync('./examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);
var structureDoc  = DocumenterFactory.getConfiguredStructure(structure);
var mdDocOut   = structureDoc.getMdDoc();
var mdDocExp   = fs.readFileSync('./examples/vhdl/md.md','utf8');
if(mdDocExp.replace(/\n/g,'').replace(/ /g,'') === mdDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.markdown] Ok!");
}
else{
  console.log("Testing... [Documentation.markdown] Fail!");
}
console.log('****************************************************************');
////////////////////////////////////////////////////////////////////////////////
var htmlDocOut = structureDoc.getHtmlDoc();
var htmlDocExp = fs.readFileSync('./examples/vhdl/html.html','utf8');
if(htmlDocExp.replace(/\n/g,'').replace(/ /g,'') === htmlDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.html] Ok!");
}
else{
  console.log("Testing... [Documentation.html] Fail!");
}
