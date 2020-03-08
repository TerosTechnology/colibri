// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

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
