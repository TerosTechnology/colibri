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
const Colibri = require('../src/main');
const Linter = Colibri.Linter;
const General = Colibri.General;


testVHDL();
testVerilog();

async function testVHDL(){
  var vhdl_simulators = [General.SIMULATORS.GHDL];
  for (let i = 0; i < vhdl_simulators.length; ++i) {
    let linter = new Linter.LinterFactory(vhdl_simulators[i]);
    for (let x = 0; x < 5; ++x) {
      let file = "examples"+path.sep+"vhdl_error"+path.sep+"example_" + x + ".vhd"
      let errors_result = await linter.lint(file,"");;
      let errors_exp = fs.readFileSync("examples"+path.sep+"vhdl_error"+path.sep+"example_" + x + ".json", 'utf8');
      errors_exp = JSON.parse(errors_exp);
      let result = compare(errors_result, errors_exp[vhdl_simulators[i].toUpperCase()]);

      console.log("Testing... Simulator: [" + vhdl_simulators[i] + "] || File: " +
        "example_" + x + ".vhdl || Result: " + result);
      if (result == false){
        console.log("Simulator:  ".yellow + vhdl_simulators[i].red);
        console.log("File:       ".yellow + file.red);
        throw new Error('Test error.'.red );
      }
    }
  }
}

async function testVerilog(){
  var verilog_simulators = [General.SIMULATORS.ICARUS,General.SIMULATORS.VERILATOR];
  for (let i = 0; i < verilog_simulators.length; ++i) {
    let linter = new Linter.LinterFactory(verilog_simulators[i]);
    for (let x = 0; x < 5; ++x) {
      let file = "examples"+path.sep+"verilog_error"+path.sep+"example_" + x + ".v"
      let errors_result = await linter.lint(file,"");
      let errors_exp = fs.readFileSync("examples"+path.sep+"verilog_error"+path.sep+"example_" + x + '.json', 'utf8');
      errors_exp = JSON.parse(errors_exp);
      let result = compare(errors_result, errors_exp[verilog_simulators[i].toUpperCase()]);

      console.log("Testing... Simulator: [" + verilog_simulators[i] + "] || File: " +
        "example_" + x + ".v || Result: " + result);
      if (result == false){
        console.log("Simulator:  ".yellow + verilog_simulators[i].red);
        console.log("File:       ".yellow + file.red);
        throw new Error('Test error.'.red);
      }
    }
  }
}

function compare(m, n) {
  if (m.length != n.length) {
    console.log("*************************************************************")
    console.log("Fail: length");
    console.log("Real ----->".yellow);
    console.log(m);
    console.log("Expected ----->".yellow);
    console.log(n);
    console.log("*************************************************************")
    return false;
  }
  var insp = ['severity', 'description'];
  for (let i = 0; i < m.length; ++i) {
    for (let x = 0; x < insp.length; ++x) {
      if (m[i][insp[x]] != n[i][insp[x]]) {
        console.log("*************************************************************")
        console.log("Fail: " + insp[x].red);
        console.log("Real ----->".yellow);
        console.log(m[i]);
        console.log("Expected ----->".yellow);
        console.log(n[i]);
        console.log("*************************************************************")
        return false;
      }
    }
  }
  for (let i = 0; i < m.length; ++i) {
    if (m[i]['location']['position'][0] != n[i]['location']['position'][0] &&
      m[i]['location']['position'][0] != n[i]['location']['position'][0]) {
      console.log("*************************************************************")
      console.log("Fail: location,position");
      console.log("Real ----->".yelow);
      console.log(m[i]);
      console.log("Expected ----->".yellow);
      console.log(n[i]);
      console.log("*************************************************************")
      return false;
    }
  }
  return true;
}
