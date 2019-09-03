const ln = require('../src/main');
const fs = require('fs');


var code = fs.readFileSync('./examples/stateMachines/verilog/sm_2.v','utf8');
var sm   = ln.StateMachineVerilog.getStateMachineVerilog(code);

// console.log(sm);
