const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

let options = {
  'type' : "normal",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
var language = ["vhdl"];
for (let i=0;i<language.length;++i){
  console.log('****************************************************************');
  for (let x=0;x<7;++x){
    var code     = fs.readFileSync('examples'+path.sep+'stateMachines'+path.sep+language[i]+path.sep+'sm_'+x+'.vhd','utf8');
    var expected = fs.readFileSync('examples'+path.sep+'stateMachines'+path.sep+language[i]+path.sep+'sm_'+x+'.txt','utf8');
    if (language[i] == "vhdl")
      var stmGenerator = new Colibri.Documenter.StateMachineVHDL();
    else
      var stmGenerator = new Colibri.Documenter.StateMachineVerilog();
    var out      = stmGenerator.getStateMachine(code,options);
    if(expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') == expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
      console.log("Testing... state machine: " + x +" "+language[i]+": Ok!");
    }
    else{
      console.log("Expected: " + expected);
      console.log("Real: " + out);
      console.log("Testing... state machine: " + x +" "+language[i]+": Fail!");
      throw new Error('Test error.');
    }
  }
}
