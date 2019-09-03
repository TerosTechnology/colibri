const fs = require('fs');
const codes = require('../../src/db/codes')
const db_manager = require('../../src/db/db_manager')
const EditorFactory = require('../../src/editor/factory')

let options = {
  'type' : "normal",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
var language = ["vhdl","verilog"];
var tested = ["component","instance","signals"];
for (let i=0;i<language.length;++i){
  console.log('****************************************************************');
  options['language'] = language[i];
  if (language[i] === "vhdl") {
    db_manager.setActiveStandardCode(codes.Standards.VHDL2008);
    db_manager.setActiveEditorCode(codes.Editors.VHDL);
  } else if (language[i] === "verilog") {
    db_manager.setActiveStandardCode(codes.Standards.VERILOG2001);
    db_manager.setActiveEditorCode(codes.Editors.VERILOG);
  }

  for (let x=0;x<tested.length;++x){
    options['type'] = tested[x];
    var structure = fs.readFileSync('./examples/'+language[i]+'/structure.json','utf8');
    structure     = JSON.parse(structure);
    var expected = fs.readFileSync('./examples/'+language[i]+'/' + tested[x] + '.txt','utf8');
    var out      = EditorFactory.getConfiguredEditor().createComponent(structure,options);
    if(expected.replace(/\n/g,'').replace(/ /g,'') === out.replace(/\n/g,'').replace(/ /g,'')){
      console.log("Testing... " + tested[x] +" "+language[i]+": Ok!");
    }
    else{
      console.log("Testing... " + tested[x] +" "+language[i]+": Fail!");
    }
  }
}
