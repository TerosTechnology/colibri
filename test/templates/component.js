// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
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

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');
const Codes = require('../../src/templates/codes')

var language = [Colibri.General.LANGUAGES.VHDL,Colibri.General.LANGUAGES.VERILOG];
var tested = [Colibri.Templates.Codes.TYPESCOMPONENTS.COMPONENT,
              Colibri.Templates.Codes.TYPESCOMPONENTS.INSTANCE,
              Colibri.Templates.Codes.TYPESCOMPONENTS.SIGNALS];

let options = {
    'type' : "normal",
    'language' : 'vhdl',
    'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
    'parameters' : [
      {'parameter' : "X"},
      {'parameter' : "Y"}
    ]
}

var structure_vhdl = []
var expected_vhdl = []
for (let x=0;x<tested.length;++x){
  structure_vhdl[x] = fs.readFileSync('examples'+path.sep+language[0]+path.sep+'example_1.vhd','utf8');
  expected_vhdl[x]  = fs.readFileSync('examples'+path.sep+language[0]+path.sep+tested[x] + '.txt','utf8');
}
templates_vhdl = new Colibri.Templates.Templates();
options['language'] = language[0]; // vhdl
options['type'] = tested[0]; // component
templates_vhdl.getTemplate(Codes.TYPES.COMPONENT,structure_vhdl[0],options).then(out =>{ check(expected_vhdl[0],out,tested[0],language[0]) });
options['type'] = tested[1]; // instance
templates_vhdl.getTemplate(Codes.TYPES.COMPONENT,structure_vhdl[1],options).then(out =>{ check(expected_vhdl[1],out,tested[1],language[0]) });
options['type'] = tested[2]; // signals
templates_vhdl.getTemplate(Codes.TYPES.COMPONENT,structure_vhdl[2],options).then(out =>{ check(expected_vhdl[2],out,tested[2],language[0]) });


var structure_verilog = []
var expected_verilog = []
for (let x=0;x<tested.length;++x){
  structure_verilog[x] = fs.readFileSync('examples'+path.sep+language[1]+path.sep+'uart.v','utf8');
  expected_verilog[x]  = fs.readFileSync('examples'+path.sep+language[1]+path.sep+tested[x] + '.txt','utf8');
}
templates_verilog = new Colibri.Templates.Templates();
options['language'] = language[1]; // verilog 
options['type'] = tested[0]; // component
templates_verilog.getTemplate(Codes.TYPES.COMPONENT,structure_verilog[0],options).then(out =>{ check(expected_verilog[0],out,tested[0],language[1]) });
options['type'] = tested[1]; // instance
templates_verilog.getTemplate(Codes.TYPES.COMPONENT,structure_verilog[1],options).then(out =>{ check(expected_verilog[1],out,tested[1],language[1]) });
options['type'] = tested[2]; // signals
templates_verilog.getTemplate(Codes.TYPES.COMPONENT,structure_verilog[2],options).then(out =>{ check(expected_verilog[2],out,tested[2],language[1]) });

function check(expected, out,tested,language) {
  console.log('****************************************************************');
  if(expected_vhdl[0].replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === out.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
    console.log("Testing... " + tested +" "+language+": Ok!".green);
  }
  else{
    console.log("Testing... " + tested +" "+language+": Fail!".red);
    throw new Error('Test error.');
  }
}