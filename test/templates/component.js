const fs = require('fs');
const Colibri = require('../../src/main');


let options = {
  'type' : "normal",
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
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

  for (let x=0;x<tested.length;++x){
    options['type'] = tested[x];
    var structure = fs.readFileSync('./examples/'+language[i]+'/structure.json','utf8');
    structure     = JSON.parse(structure);
    var expected = fs.readFileSync('./examples/'+language[i]+'/' + tested[x] + '.txt','utf8');
    var templates = new Colibri.Templates.Templates();
    if (language[i] == "vhdl")
      var out = templates.getVHDLComponent(structure, options);
    else
      var out = templates.getVerilogComponent(structure, options);

    if(expected.replace(/\n/g,'').replace(/ /g,'') === out.replace(/\n/g,'').replace(/ /g,'')){
      console.log("Testing... " + tested[x] +" "+language[i]+": Ok!");
    }
    else{
      console.log("Testing... " + tested[x] +" "+language[i]+": Fail!");
      throw new Error('Test error.');
    }
  }
}
