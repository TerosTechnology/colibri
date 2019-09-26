const colibri = require('../src/main');


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
    "working_dir": "/home/carlos/repositorios/cordicHDL/tb",
    "files": [
        {"name": "/home/carlos/repositorios/cordicHDL/tb/cordic_top_run.py",
         "file_type": "py"}
    ],
    "tool": "ghdl"
}






var manager = new colibri.Simulators.Manager("localhost","8000");
manager.runTool(example).then( respuesta => console.log(respuesta))

// var manager = new colibri.Simulators.Manager("localhost","8000");
// manager.getSuites().then( respuesta => console.log(respuesta[1]['simulators'][0]))
