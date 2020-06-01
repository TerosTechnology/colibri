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
var tested = [Codes.TYPESCOMPONENTS.COMPONENT,
              Codes.TYPESCOMPONENTS.INSTANCE,
              Codes.TYPESCOMPONENTS.SIGNALS];

let options_mult =[]
let options = {
    'type' : "normal",
    'language' : 'vhdl',
    'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
    'parameters' : [
      {'parameter' : "X"},
      {'parameter' : "Y"}
    ]
}
for (let x = 0; x < tested.length; x++) {
  options_mult[x] = options;
}
var structure_vhdl = []
var expected_vhdl = []
for (let x=0;x<tested.length;++x){
  structure_vhdl[x] = fs.readFileSync('examples'+path.sep+language[0]+path.sep+'example_1.vhd','utf8');
  expected_vhdl[x]  = fs.readFileSync('examples'+path.sep+language[0]+path.sep+tested[x] + '.txt','utf8');
}
templates_vhdl = new Colibri.Templates.Templates(Codes.TYPES.COMPONENT,options);
templates_vhdl = new Colibri.Templates.Templates(Codes.TYPES.COMPONENT,options);
templates_vhdl = new Colibri.Templates.Templates(Codes.TYPES.COMPONENT,options);
options_mult[0]['type'] = tested[0]; // component
templates_vhdl.getTemplate(structure_vhdl[0],options_mult[0]).then(out =>{ check(expected_vhdl[0],out,tested[0],language[0]) });
options_mult[1]['type'] = tested[1]; // instance
templates_vhdl.getTemplate(structure_vhdl[1],options_mult[1]).then(out =>{ check(expected_vhdl[1],out,tested[1],language[0]) });
options_mult[2]['type'] = tested[2]; // signals
templates_vhdl.getTemplate(structure_vhdl[2],options_mult[2]).then(out =>{ check(expected_vhdl[2],out,tested[2],language[0]) });

let options_verilog = {
  'type' : "normal",
  'language' : 'verilog',
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
let options_mult_ver =[]
for (let x = 0; x < tested.length; x++) {
  options_mult_ver[x] = options_verilog;
}
var structure_verilog = []
var expected_verilog = []
for (let x=0;x<tested.length;++x){
  structure_verilog[x] = fs.readFileSync('examples'+path.sep+language[1]+path.sep+'uart.v','utf8');
  expected_verilog[x]  = fs.readFileSync('examples'+path.sep+language[1]+path.sep+tested[x] + '.txt','utf8');
}
templates_verilog = new Colibri.Templates.Templates(Codes.TYPES.COMPONENT,options_verilog);
options_mult_ver[0]['type'] = tested[0]; // component
templates_verilog.getTemplate(structure_verilog[0],options_mult_ver[0]).then(out =>{ check(expected_verilog[0],out,tested[0],language[1]) });
options_mult_ver[1]['type'] = tested[1]; // instance
templates_verilog.getTemplate(structure_verilog[1],options_mult_ver[1]).then(out =>{ check(expected_verilog[1],out,tested[1],language[1]) });
options_mult_ver[2]['type'] = tested[2]; // signals
templates_verilog.getTemplate(structure_verilog[2],options_mult_ver[2]).then(out =>{ check(expected_verilog[2],out,tested[2],language[1]) });

function check(expected, out,tested,language) {
  console.log('****************************************************************');
  if(expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === out.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
    console.log("Testing... " + tested +" "+language+": Ok!".green);
  }
  else{
    console.log("Testing... " + tested +" "+language+": Fail!".red);
    throw new Error('Test error.');
  }
}