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
const General = Colibri.General;

if (process.argv[2] === 'verilog') {
  for (let x = 0; x < 11; ++x) {
    var ParserLang = General.LANGUAGES.VERILOG;
    let example_exp_result = fs.readFileSync(__dirname + '/examples/verilog/example_' + x + '.json', 'utf8');
    example_exp_result = JSON.parse(example_exp_result);
    let example_verilog = fs.readFileSync(__dirname + '/examples/verilog/example_' + x + '.v', 'utf8');
    get_structure(ParserLang, "!", example_verilog,x).then(example_result => {
      // console.log(example_result);
      let rs = compareVerilogTs(example_result, example_exp_result, "example_" + x + ".v");
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
  for (let x = 0; x < 11; ++x) {
    var ParserLang = General.LANGUAGES.VHDL;
    let example_exp_result = fs.readFileSync(__dirname + '/examples/vhdl/example_' + x + '.json', 'utf8');
    example_exp_result = JSON.parse(example_exp_result);
    let example_vhd = fs.readFileSync(__dirname + '/examples/vhdl/example_' + x + '.vhd', 'utf8');
    get_structure(ParserLang, "!", example_vhd,x).then(example_result => {
      // console.log(example_result);
      let rs = compareVhdl(example_result, example_exp_result, "example_" + x + ".vhd");
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
//////////////////////////////////////////////////////////////////////////////
function compareVhdl(m, n, file) {
  //var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if (m['entity']['name'] !== n['entity']['name']) { return false; }
  // if(m['architecture']['name'] != n['architecture']['name']) { return false; }
  var ch1 = check(m['generics'], n['generics'], ['name', 'type', 'default_value', 'description'], "generics", file);
  var ch2 = check(m['ports'], n['ports'], ['name', 'direction', 'type', 'default_value', 'description'], "ports", file);
  var ch3 = check(m['declarations']['signals'], n['declarations']['signals'], ['name', 'type', 'description'], "signals", file);
  var ch4 = check(m['body']['processes'], n['body']['processes'], ['name', 'sens_list', 'description'], "processes", file);
  var ch5 = check(m['body']['instantiations'], n['body']['instantiations'], ['name', 'type', 'description'], "instantiations", file);
  var ch6 = check(m['declarations']['types'], n['declarations']['types'], ['name', 'type', 'description'], "types", file);
  var ch7 = check(m['declarations']['constants'], n['declarations']['constants'], ['name', 'type', 'default_value', 'description'], "constants", file);
  var ch8 = check(m['declarations']['functions'], n['declarations']['functions'], ['name', 'description'], "functions", file);

  return ch1 && ch2 && ch3 && ch4 && ch5 && ch6 && ch7 && ch8;
}

function compareVerilogTs(m, n, file) {
  //var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if (m['entity']['name'] !== n['entity']['name']) { return false; }
  var ch1 = check(m['generics'], n['generics'], ['name', 'type', 'default_value', 'description'], "generics", file);
  var ch2 = check(m['ports'], n['ports'], ['name', 'direction', 'type', 'default_value', 'description'], "ports", file);
  var ch3 = check(m['declarations']['signals'], n['declarations']['signals'], ['name', 'type', 'description'], "signals", file);
  var ch4 = check(m['body']['processes'], n['body']['processes'], ['name', 'sens_list', 'description'], "processes", file);
  var ch5 = check(m['body']['instantiations'], n['body']['instantiations'], ['name', 'type', 'description'], "instantiations", file);
  var ch6 = check(m['declarations']['types'], n['declarations']['types'], ['name', 'type', 'description'], "types", file);
  var ch7 = check(m['declarations']['constants'], n['declarations']['constants'], ['name', 'type', 'default_value', 'description'], "constants", file);
  var ch8 = check(m['declarations']['functions'], n['declarations']['functions'], ['name', 'description'], "functions", file);

  return ch1 && ch2 && ch3 && ch4 && ch5 && ch6 && ch7 && ch8;
}

function check(m, n, cmp, type, file) {
  if (m.length !== n.length) {
    console.log("*************************************************************");
    console.log("Fail: " + type.yellow + " in file: " + file.red);
    console.log("Real ----->".yellow);
    console.log(m);
    console.log("Expected ----->".yellow);
    console.log(n);
    console.log("*************************************************************");
    return false;
  }
  for (let i = 0; i < m.length; ++i) {
    for (let z = 0; z < cmp.length; ++z) {
      // console.log(m[i]['name'])
      // console.log(file)
      // console.log(type)
      // console.log(cmp[z])

      let name_m;
      let name_n;
      if (m[i][cmp[z]] === undefined) {
        name_m = "";
      }
      else {
        name_m = m[i][cmp[z]].toLowerCase().replace(/\s/g, '').replace(/\t/g, '');
      }
      name_n = n[i][cmp[z]].toLowerCase().replace(/\s/g, '').replace(/\t/g, '');

      if (name_m !== name_n) {
        console.log("*********************************************************");
        console.log(JSON.stringify(name_m));
        console.log(JSON.stringify(name_n));
        console.log("Fail: " + type.yellow + " in file: " + file.red);
        console.log("Real ----->".yellow);
        console.log(m);
        console.log("Expected ----->".yellow);
        console.log(n);
        console.log("*********************************************************");
        return false;
      }
    }
  }
  return true;
}

async function get_structure(ParserLang, symbol, src,num) {
  let parser = new ParserLib.ParserFactory;
  let lang_parser = await parser.getParser(ParserLang, symbol);
  let structure = await lang_parser.get_all(src);
  // console.log(structure);
  if (process.argv[3] === 'out') {
    fs.writeFileSync(__dirname + '/examples/'+process.argv[2]+'/test_json/test_'+num+'.json', JSON.stringify(structure), 'utf8');
  }
  return structure;
}


