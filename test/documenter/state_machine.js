// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saezs
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
const stm_parser = require('../../src/parser/stm_parser');
const General = Colibri.General;
const deep_check = require('../helper.js');

let comment_symbol = "!";
let language = [General.LANGUAGES.VHDL, General.LANGUAGES.VERILOG];
let extension = ['vhd', 'v'];

console.log('****************************************************************');
if (process.argv[2] === 'vhdl') {
  let lang = language[0];
  let file= extension[0];
  let num_test = 1;
  check_lang(lang, num_test,file);
}
if (process.argv[2] === 'verilog') {
  let lang = language[1];
  let file= extension[1];
  let num_test = 1;
  check_lang(lang, num_test,file);
}

function check_lang(lang, num_test,file) {
  for (let x = 0; x < num_test; x++) {
    var code = fs.readFileSync(`resources${path.sep}state_machines${path.sep}${lang}${path.sep}sm_${x}.${file}`, 'utf8');
    var expected = JSON.parse(fs.readFileSync('resources' + path.sep + 'state_machines'
      + path.sep + lang + path.sep + 'sm_' + x + '.json', 'utf8'));
    get_stm(lang, code, comment_symbol).then(out => {
      // fs.writeFileSync("/home/ismael/Desktop/test.json", JSON.stringify(out), 'utf8');
      if (deep_check(out, expected, `${lang}`, `sm_${x}.${file}`, ['description'])) {
        console.log("Testing... state machine: " + x + " " + lang + ": Ok!".green);
      }
      else {
        console.log("Expected: " + expected);
        console.log("Real: " + out);
        console.log("Testing... state machine: " + x + " " + lang + ": Fail!".red);
        throw new Error('Test error.'.red);
      }
    });
  }
}

async function get_stm(lang, code, comment_symbol) {
  let stm_array = await stm_parser.get_svg_sm(lang, code, comment_symbol);
  return stm_array.stm;
}
