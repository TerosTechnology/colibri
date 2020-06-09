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
let options_c = {'type' : "normal"}
let options_i = {'type' : "normal"}
let options_s = {'type' : "normal"}
templates_vhdl = new Colibri.Templates.TemplatesFactory();
let templates_vhdl_class = templates_vhdl.getTemplate(Codes.TYPES.COMPONENT,options)
options_c['type'] = tested[0]; // component
templates_vhdl_class.createComponent(structure_vhdl[0],options_c).then(out =>{ check(expected_vhdl[0],out,tested[0],language[0]) });
options_i['type'] = tested[1]; // instance
templates_vhdl_class.createComponent(structure_vhdl[1],options_i).then(out =>{ check(expected_vhdl[1],out,tested[1],language[0]) });
options_s['type'] = tested[2]; // signals
templates_vhdl_class.createComponent(structure_vhdl[2],options_s).then(out =>{ check(expected_vhdl[2],out,tested[2],language[0]) });

let options_verilog = {
  'type' : "normal",
  'language' : 'verilog',
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
var structure_verilog = []
var expected_verilog = []
for (let x=0;x<tested.length;++x){
  structure_verilog[x] = fs.readFileSync('examples'+path.sep+language[1]+path.sep+'uart.v','utf8');
  expected_verilog[x]  = fs.readFileSync('examples'+path.sep+language[1]+path.sep+tested[x] + '.txt','utf8');
}
let options_ver_c = {'type' : "normal"}
let options_ver_i = {'type' : "normal"}
let options_ver_s = {'type' : "normal"}
templates_verilog = new Colibri.Templates.TemplatesFactory();
let templates_verilog_class = templates_verilog.getTemplate(Codes.TYPES.COMPONENT,options_verilog);
options_ver_c['type'] = tested[0]; // component
templates_verilog_class.createComponent(structure_verilog[0],options_ver_c).then(out =>{ check(expected_verilog[0],out,tested[0],language[1]) });
options_ver_i['type'] = tested[1]; // instance
templates_verilog_class.createComponent(structure_verilog[1],options_ver_i).then(out =>{ check(expected_verilog[1],out,tested[1],language[1]) });
options_ver_s['type'] = tested[2]; // signals
templates_verilog_class.createComponent(structure_verilog[2],options_ver_s).then(out =>{ check(expected_verilog[2],out,tested[2],language[1]) });

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