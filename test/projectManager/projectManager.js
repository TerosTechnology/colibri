const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

//Create and save trs
var sources = ["source_0.v","source_1.v","source_2.v","source_3.v"];
var sources_p = [
  {
    name : "source_0.v",
    type: "verilogSource-2005"
  },
  {
    name : "source_1.v",
    type: "verilogSource-2005"
  },
  {
    name : "source_2.v",
    type: "verilogSource-2005"
  },
  {
    name : "source_3.v",
    type: "verilogSource-2005"
  }
]
var testbenches = ["testbench_0.v","testbench_1.v","testbench_2.v"];
var testbenches_p = [
  {
    name : "testbench_0.v",
    type: "verilogSource-2005"
  },
  {
    name : "testbench_1.v",
    type: "verilogSource-2005"
  },
  {
    name : "testbench_2.v",
    type: "verilogSource-2005"
  }
]
var project = {
  src : sources_p,
  tb : testbenches_p
};
var data = JSON.stringify(project);
fs.writeFileSync("prj.trs",data);
//*****************************************************************************
//*****************************************************************************
var projectManager = new Colibri.ProjectManager.ProjectManager();
//Load trs project
projectManager.loadProject("prj.trs");
//Add source
sources.push("source_4.v");
sources.push("source_5.v");
projectManager.addSource(["source_4.v","source_5.v"]);
//Add testbench
testbenches.push("testbench_3.v");
projectManager.addTestbench(["testbench_3.v"]);
//Delete source
sources = sources.filter(e => e !== "source_2.v");
projectManager.deleteSource(["source_2.v"]);
//Delete testbench
testbenches = testbenches.filter(e => e !== "testbench_1.v");
testbenches = testbenches.filter(e => e !== "testbench_2.v");
projectManager.deleteTestbench(["testbench_1.v","testbench_2.v"]);
//Get source names
var sourceNames = projectManager.getSourceName();
if (sourceNames.toString() == sources.toString())
  console.log("Testing... getSourceName()")
else{
  console.log(sources);
  console.log(sourceNames)
  throw new Error('Test error source names');
}
//Get testbench names
var testbenchNames = projectManager.getTestbenchName();
if (testbenchNames.toString() == testbenches.toString())
  console.log("Testing... getTestbenchName()")
else {
  console.log(testbenches);
  console.log(testbenchNames)
  throw new Error('Test error testbench names.');
}
//Save trs
projectManager.saveTrs("prj_created.trs");
