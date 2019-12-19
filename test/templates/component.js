const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

let options = {
  'type' : "normal",
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
var language = [Colibri.General.LANGUAGES.VHDL,Colibri.General.LANGUAGES.VERILOG];
var tested = [Colibri.Templates.Codes.TYPESCOMPONENTS.COMPONENT,
              Colibri.Templates.Codes.TYPESCOMPONENTS.INSTANCE,
              Colibri.Templates.Codes.TYPESCOMPONENTS.SIGNALS];
for (let i=0;i<language.length;++i){
  console.log('****************************************************************');
  options['language'] = language[i];
  for (let x=0;x<tested.length;++x){
    options['type'] = tested[x];
    var structure = fs.readFileSync('examples'+path.sep+language[i]+path.sep+'structure.json','utf8');
    structure     = JSON.parse(structure);
    var expected = fs.readFileSync('examples'+path.sep+language[i]+path.sep+tested[x] + '.txt','utf8');
    var templates = new Colibri.Templates.Templates();
    var out = templates.getTemplate(Colibri.Templates.Codes.TYPES.COMPONENT,structure,options);

    if(expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === out.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
      console.log("Testing... " + tested[x] +" "+language[i]+": Ok!");
    }
    else{
      console.log("Testing... " + tested[x] +" "+language[i]+": Fail!");
      throw new Error('Test error.');
    }
  }
}
