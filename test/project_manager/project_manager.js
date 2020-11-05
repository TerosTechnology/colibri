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

const fs = require('fs');
const Colibri = require('../../src/main');

//Create and save trs
var sources = ["source_0.v","source_1.v","source_2.v","source_3.v"];
var sources_p = [
  {
    name : "source_0.v",
    file_type: "verilogSource-2005"
  },
  {
    name : "source_1.v",
    file_type: "verilogSource-2005"
  },
  {
    name : "source_2.v",
    file_type: "verilogSource-2005"
  },
  {
    name : "source_3.v",
    file_type: "verilogSource-2005"
  }
];
var testbenches = ["testbench_0.v","testbench_1.v","testbench_2.v"];
var testbenches_p = [
  {
    name : "testbench_0.v",
    file_type: "verilogSource-2005"
  },
  {
    name : "testbench_1.v",
    file_type: "verilogSource-2005"
  },
  {
    name : "testbench_2.v",
    file_type: "verilogSource-2005"
  }
];
var configs = ["testbench_0.v","testbench_1.v","testbench_2.v"];
var configs_p =
  {
    suite : "",
    tool : "",
    languaje : "",
    name : "",
    top_level : "",
    top_level_file : "",
    working_dir : "",
    gtkwave : ""
  };
var project = {
  src : sources_p,
  tb : testbenches_p,
  config: configs_p
};
var data = JSON.stringify(project);
fs.writeFileSync("prj.trs",data);
//*****************************************************************************
//*****************************************************************************
var project_manager = new Colibri.Project_manager.Manager();
//Load trs project
project_manager.load_project("prj.trs");
//Add source
sources.push("source_4.v");
sources.push("source_5.v");
project_manager.add_source_from_array(["source_4.v","source_5.v"]);
//Add testbench
testbenches.push("testbench_3.v");
project_manager.add_testbench_from_array(["testbench_3.v"]);
//Delete source
sources = sources.filter(e => e !== "source_2.v");
project_manager.delete_source_from_array(["source_2.v"]);
//Delete testbench
testbenches = testbenches.filter(e => e !== "testbench_1.v");
testbenches = testbenches.filter(e => e !== "testbench_2.v");
project_manager.delete_testbench_from_array(["testbench_1.v","testbench_2.v"]);
//Get source names
var sourceNames = project_manager.get_source_name();
if (sourceNames.toString() === sources.toString()){
  console.log("Testing... getSourceName()");
}
else{
  console.log(sources);
  console.log(sourceNames);
  throw new Error('Test error source names');
}
//Get testbench names
var testbenchNames = project_manager.get_testbench_name();
if (testbenchNames.toString() === testbenches.toString()){
  console.log("Testing... getTestbenchName()");
}
else {
  console.log(testbenches);
  console.log(testbenchNames);
  throw new Error('Test error testbench names.');
}
//Save trs
project_manager.save_project("prj_created.trs");
process.exit(0);
