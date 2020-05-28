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

const fs = require('fs');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('./examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);
var documenter = new Colibri.Documenter.BaseStructure(structure);
var mdDocOut   = documenter.getMdDoc();
var mdDocExp   = fs.readFileSync('./examples/vhdl/md.md','utf8');
if(mdDocExp.replace(/\n/g,'').replace(/ /g,'') === mdDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.markdown] Ok!");
}
else{
  console.log("Testing... [Documentation.markdown] Fail!");
  throw new Error('Test error.');
}
console.log('****************************************************************');
////////////////////////////////////////////////////////////////////////////////
var htmlDocOut = documenter.getHtmlDoc();
var htmlDocExp = fs.readFileSync('./examples/vhdl/html.html','utf8');
if(htmlDocExp.replace(/\n/g,'').replace(/ /g,'') === htmlDocOut.replace(/\n/g,'').replace(/ /g,'')){
  console.log("Testing... [Documentation.html] Ok!");
}
else{
  console.log("Testing... [Documentation.html] Fail!");
  throw new Error('Test error.');
}
