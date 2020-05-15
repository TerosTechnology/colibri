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

let path_example = 'examples'+path.sep+'vhdl'+path.sep+'runpy'+path.sep;
for (let x=0;x<2;++x){
  let structure = fs.readFileSync(path_example+'runpyConf_'+x+'.json','utf8');
  structure     = JSON.parse(structure);
  let runpy = new Colibri.Templates.Templates();
  let runpy_expected = fs.readFileSync(path_example+'run_'+x+'.py','utf8');
  let runpy_template = runpy.getVUnitTemplate(structure);
  check_runpy(runpy_expected,runpy_template,x);
}

function check_runpy(runpy_expected,runpy_template,x){
  console.log('****************************************************************');
  if(runpy_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') === runpy_template.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: runpy_"+x+"  ok!".green);
  }
  else{
    console.log("---> Tested: runpy_"+x+"  fail!".red);
    fs.writeFileSync("testdsfs.py",runpy_template)
    throw new Error('Test error.');
  }
}
