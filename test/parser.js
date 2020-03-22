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
const general = require('../src/general/general')
const General = Colibri.General;
const Parser = Colibri.Parser;
// const VhdlParser = require('../src/parser/vhdlparser')

var test_result = true;

for (let x=0;x<6;++x){
  var ParserLang = [General.LANGUAGES.VHDL];
  let parser = new Parser.ParserFactory;
  parser = parser.getParser(ParserLang,"!");
  let example_vhd = fs.readFileSync('./examples/vhdl/example_'+x+'.vhd' ,'utf8');
  let example_result  = parser.getAll(example_vhd);
  let example_exp_result = fs.readFileSync('./examples/vhdl/example_'+x+'.json','utf8');
  example_exp_result     = JSON.parse(example_exp_result);
  // console.log(example_result);
  let rs = compareVhdl(example_result,example_exp_result,"example_"+x+".vhd");
  console.log("Test " + rs + " ["+"example_"+x+".vhd"+"]");
  if (rs!= true) {
    test_result= false;
  }
}
//////////////////////////////////////////////////////////////////////////////
for (let x=0;x<8;++x){
  var ParserLang = [General.LANGUAGES.VERILOG];
  let parser = new Parser.ParserFactory;
  parser = parser.getParser(ParserLang,"!");
  let example_verilog = fs.readFileSync('./examples/verilog/example_'+x+'.v' ,'utf8');
  let example_result  = parser.getAll(example_verilog);
  let example_exp_result = fs.readFileSync('./examples/verilog/example_'+x+'.json','utf8');
  example_exp_result     = JSON.parse(example_exp_result);
  // console.log(example_result);
  let rs = compareVerilogTs(example_result,example_exp_result,"example_"+x+".v");
  console.log("Test " + rs + " ["+"example_"+x+".v"+"]");
  if (rs!= true) {
    test_result= false;
  }
}
//////////////////////////////////////////////////////////////////////////////
function compareVhdl(m,n,file){
  var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  // if(m['architecture']['name'] != n['architecture']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','type','comment'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','direction','type','comment'],"ports",file);
  // var ch3 = check(m['signals'],n['signals'],['name','type'],"signals",file);
  // var ch4 = check(m['constants'],n['constants'],['name','type'],"constants",file);
  // var ch5 = check(m['types'],n['types'],['name','type'],"types",file);
  // var ch6 = check(m['process'],n['process'],['name'],"process",file);

  return ch0 && ch1 && ch2;
}
function compareVerilog(m,n,file){
  var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','type'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','kind','type'],"ports",file);
  var ch3 = check(m['regs'],n['regs'],['name','kind','type'],"regs",file);
  var ch4 = check(m['nets'],n['nets'],['name','kind','type'],"nets",file);
  var ch5 = check(m['constants'],n['constants'],['name','kind'],"constants",file);

  return ch0 && ch1 && ch2 && ch3 && ch4 && ch5;
}
function compareVerilogTs(m,n,file){
  var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','type','comment'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','direction','type','comment'],"ports",file);
  // var ch3 = check(m['regs'],n['regs'],['name','kind','type'],"regs",file);
  // var ch4 = check(m['nets'],n['nets'],['name','kind','type'],"nets",file);
  // var ch5 = check(m['constants'],n['constants'],['name','kind'],"constants",file);

  return ch0 && ch1 && ch2;
}

function check(m,n,cmp,type,file){
  if(m.length != n.length) {
    console.log("*************************************************************")
    console.log("Fail: " + type.yellow + " in file: " + file.red);
    console.log("Real ----->".yellow);
    console.log(m);
    console.log("Expected ----->".yellow);
    console.log(n);
    console.log("*************************************************************")
    return false;
  }
  for (let i=0;i<m.length;++i) {
    for (let z=0;z<cmp.length;++z){
      // console.log(m[i]['name'])
      // console.log(file)
      // console.log(type)
      // console.log(cmp[z])

      let name_m;
      let name_n;
      if(m[i][cmp[z]] == undefined){
        name_m = "";
      }
      else{
        name_m = m[i][cmp[z]].toLowerCase().replace(/\s/g,'').replace(/\t/g,'');
      }
      name_n = n[i][cmp[z]].toLowerCase().replace(/\s/g,'').replace(/\t/g,'');

      if(name_m != name_n) {
        console.log("*********************************************************")
        console.log(JSON.stringify(name_m));
        console.log(JSON.stringify(name_n));
        console.log("Fail: " + type.yellow + " in file: " + file.red);
        console.log("Real ----->".yellow);
        console.log(m);
        console.log("Expected ----->".yellow);
        console.log(n);
        console.log("*********************************************************")
        return false;
      }
    }
  }
  return true;
}

if (test_result == true)
  console.log("All test...  OK!".green)
else{
  throw new Error('Test errors'.red);
}
