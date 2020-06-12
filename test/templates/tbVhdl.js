/* eslint-disable no-console */
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

// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');
const Codes = require('../../src/templates/codes');

let options = {
  'type' : "normal",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
};
let language = Colibri.General.LANGUAGES.VHDL;
////////////////////////////////////////////////////////////////////////////////
let structure = fs.readFileSync(__dirname + path.sep + 'examples'+path.sep+'vhdl'+path.sep+'example_1.vhd','utf8');
let test_expected_vhdl = fs.readFileSync(__dirname + path.sep +'examples'+path.sep+'vhdl'+path.sep+'tbVhdl.vhd','utf8');
let templates = new Colibri.Templates.Templates_factory();
let templates_class = templates.get_template(Codes.TYPES.TESTBENCH,language);
templates_class.generate(structure,options).then(test_vhd => {
  console.log('****************************************************************');
  if(test_expected_vhdl.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') 
        === test_vhd.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("Testing... tbVhdl: Ok!".green);
  }
  else{
    console.log("Expected -->".yellow);
    console.log(test_expected_vhdl);
    console.log("Real     -->".yellow);
    console.log(test_vhd);
    console.log("Testing... tbVhdl: Fail!".red);
    throw new Error('Test error.');
  }
});

////////////////////////////////////////////////////////////////////////////////
let options_vunit = {
  'type' : "vunit",
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
};
let test_expected_vunit_tb = fs.readFileSync(__dirname + path.sep + 'examples'
                      +path.sep+'vhdl'+path.sep+'tbVhdlVunit.vhd','utf8');
templates = new Colibri.Templates.Templates_factory();
let templates_vunit_class = templates.get_template(Codes.TYPES.TESTBENCH,language);
templates_vunit_class.generate(structure,options_vunit).then(test_vhdl_vunit =>{
  if(test_expected_vunit_tb.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') 
        === test_vhdl_vunit.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
    console.log("Testing... tbVhdlVunit: Ok!".green);
  }
  else{
    console.log("Expected -->".yellow);
    console.log(test_expected_vunit_tb);
    console.log("Real     -->".yellow);
    console.log(test_vhdl_vunit);
    console.log("Testing... tbVhdlVunit: Fail!".red);
    throw new Error('Test error.');
  }
  console.log('****************************************************************');
} );


