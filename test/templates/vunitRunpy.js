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
const Codes = require('../../src/templates/codes')

let path_example = __dirname + path.sep + 'examples'+path.sep+'vhdl'+path.sep+'runpy'+path.sep;
let lang= "vhdl";
let runpy = new Colibri.Templates.Templates_factory();
for (let x=0;x<5;++x){
  let structure = fs.readFileSync(path_example+'runpyConf_'+x+'.json','utf8');
  structure     = JSON.parse(structure);
  let runpy_expected = fs.readFileSync(path_example+'run_'+x+'.py','utf8');
  let runpy_c = runpy.get_template(Codes.TYPES.VUNIT,lang)
  let out = runpy_c.generate(structure);
  check_runpy(runpy_expected,out,x);
}

function check_runpy(runpy_expected,runpy_template,x){
  console.log('****************************************************************');
  if(runpy_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') 
        === runpy_template.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: runpy_"+x+"  ok!".green);
  }
  else{
    console.log("---> Tested: runpy_"+x+"  fail!".red);
    throw new Error('Test error.');
  }
}
