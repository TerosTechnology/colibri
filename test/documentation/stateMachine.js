// const ln = require('../src/main');
// const fs = require('fs');
//
// let options = {
//   'language' : "vhdl",
//   'version'  : "2008",
//   'type' : "normal",
//   'parameters' : [
//     {'parameter' : "X"},
//     {'parameter' : "Y"}
//   ]
// }
//
// var code = fs.readFileSync('./examples/stateMachines/vhdl/sm_7.vhd','utf8');
// var sm   = ln.Documentation.getStateMachine(code,options);
//
// console.log(sm);


const fs = require('fs');
const codes = require('../../src/db/codes')
const db_manager = require('../../src/db/db_manager')
const DocumenterFactory = require('../../src/documenter/factory')

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
  if (language[i] === "vhdl") {
    db_manager.setActiveStandardCode(codes.Standards.VHDL2008);
    db_manager.setActiveDocumenterCode(codes.Documenters.VHDL);
  } else if (language[i] === "verilog") {
    db_manager.setActiveStandardCode(codes.Standards.VERILOG2001);
    db_manager.setActiveDocumenterCode(codes.Documenters.VERILOG);
  }
  for (let x=0;x<7;++x){
    var code     = fs.readFileSync('./examples/stateMachines/'+language[i]+'/sm_'+x+'.vhd','utf8');
    var expected = fs.readFileSync('./examples/stateMachines/'+language[i]+'/sm_'+x+'.txt','utf8');
    var out      = DocumenterFactory.getConfiguredStateMachine().getStateMachine(code,options);
    if(expected.replace(/\n/g,'').replace(/ /g,'') === out.replace(/\n/g,'').replace(/ /g,'')){
      console.log("Testing... state machine: " + x +" "+language[i]+": Ok!");
    }
    else{
      console.log("Testing... state machine: " + x +" "+language[i]+": Fail!");
    }
  }
}
