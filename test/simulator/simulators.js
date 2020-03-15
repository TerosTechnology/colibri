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

const colibri = require('../../src/main');


// var example = {
//     "name": "test_adder_vlog",
//     "top_level": "adder",
//     "simulator": 2,
//     "language": 2,
//     "module": "/home/carlos/repositorios/cocotbExamples/tools/cocotb/simple/test_adder.py",
//     "files": [
//         {
//             "path": "/home/carlos/repositorios/cocotbExamples/hdl/adder.v"
//         }
//     ]
// }


// var example = {
//     "suite": "cocotb",
//     "working_dir": "/home/carlos/repositorios/cocotbExamples/tools/cocotb/simple",
//     "files": [
//         {"name": "/home/carlos/repositorios/cocotbExamples/tools/cocotb/simple/test_adder.py",
//          "file_type": "py"},
//         {"name": "/home/carlos/repositorios/cocotbExamples/hdl/adder.v",
//          "file_type": "verilogSource-2005"}
//     ],
//     "top_level": "adder",
//     "tool": "icarus",
//     "tool_options": [
//         {"group": "--vcd", "argument": "func.vcd"}
//      ]
// }

var example = {
    "suite": "vunit",
    "working_dir": "/home/carlos/repo/simple_example_vunit/adder_simple",
    "files": [
        {"name": "/home/carlos/repo/simple_example_vunit/adder_simple/adder_run.py",
         "file_type": "py"}
    ],
    "tool": "ghdl"
}

codes_response = colibri.Simulators.Codes.CODE_RESPONSE;
ip   = "localhost"
port = 8000

var configurator = new colibri.ProjectManager.Configurator;
var manager = new colibri.ProjectManager.Manager(configurator);
//******************************************************************************
// Check error: bad port
//******************************************************************************
manager.getSuites(ip,port+1).then(function(response){
  if (response['result']['CODE'] !== codes_response['UNREACHABLE_SERVER']['CODE'])
    throw new Error('Code received !== ' + codes_response['UNREACHABLE_SERVER']['CODE']);
  else
    console.log("Check error: bad port... OK");
});
//******************************************************************************
// Check successful: correct port
//******************************************************************************
manager.getSuites(ip,port).then(function(response){
  if (response['result']['CODE'] !== codes_response['SUCCESSFUL']['CODE'])
    throw new Error('Code received !== ' + codes_response['SUCCESSFUL']['CODE']);
  else
    console.log("Check successful: correct port... OK");
})
//******************************************************************************
// Check simulation
//******************************************************************************
configurator.setSuite("vunit");
configurator.setTool("ghdl");
configurator.setWorkingDir("/home/carlos/repo/simple_example_vunit/adder_simple");
manager.setConfiguration(configurator);
manager.addSource(["/home/carlos/repo/simple_example_vunit/adder_simple/adder_run.py"]);
manager.simulate(ip,port).then(function(response){
  if (response['result']['CODE'] !== codes_response['SUCCESSFUL']['CODE'])
    throw new Error('Code received !== ' + codes_response['SUCCESSFUL']['CODE']);
  else
    console.log("Check successful simulation... OK");
})
