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
const Colibri = require('../src/main');
const ParserLib = require('../src/parser/factory');
const deep_check = require('./helper.js');
const General = Colibri.General;

if (process.argv[2] === 'verilog') {
  for (let x = 0; x < 11; ++x) {
    var ParserLang = General.LANGUAGES.VERILOG;
    let example_exp_result = fs.readFileSync(__dirname + '/examples/verilog/example_' + x + '.json', 'utf8');
    example_exp_result = JSON.parse(example_exp_result);
    let example_verilog = fs.readFileSync(__dirname + '/examples/verilog/example_' + x + '.v', 'utf8');
    get_structure(ParserLang, "!", example_verilog,x).then(example_result => {
      // console.log(example_result);
      let rs = deep_check(example_result, example_exp_result,"verilog_example_" + x ,"example_" + x + ".v",['line','start_line']);
      console.log("Test " + rs + " [" + "example_" + x + ".v" + "]");
      if (rs === true) {
        console.log("Test...  OK!".green);
      }
      else {
        console.log("Test...  fail!".red);
        throw new Error('Test errors'.red);
      }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////
if (process.argv[2] === 'vhdl') {
  for (let x = 0; x < 15; ++x) {
    var ParserLang = General.LANGUAGES.VHDL;
    let example_exp_result = fs.readFileSync(__dirname + '/examples/vhdl/example_' + x + '.json', 'utf8');
    example_exp_result = JSON.parse(example_exp_result);
    let example_vhd = fs.readFileSync(__dirname + '/examples/vhdl/example_' + x + '.vhd', 'utf8');
    get_structure(ParserLang, "!", example_vhd,x).then(example_result => {
      // console.log(example_result);
      let rs = deep_check(example_result, example_exp_result,"vhdl_example_" + x ,"example_" + x + ".vhd",['line','start_line']);
      console.log("Test " + rs + " [" + "example_" + x + ".vhd" + "]");
      if (rs === true) {
        console.log("Test...  OK!".green);
      }
      else {
        console.log("Test...  fail!".red);
        throw new Error('Test errors'.red);

      }
    });
  }
}


async function get_structure(ParserLang, symbol, src,num) {
  let parser = new ParserLib.ParserFactory;
  let lang_parser = await parser.getParser(ParserLang, symbol);
  let structure = await lang_parser.get_all(src);
  // console.log(structure);
  if (process.argv[3] === 'out') {
    fs.writeFileSync(__dirname + '/examples/'+process.argv[2]+'/test_json/example_'+num+'.json', JSON.stringify(structure), 'utf8');
  }
  return structure;
}
