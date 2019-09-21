const colibri = require('../src/main');


var example = {
    "name": "test_adder_vlog",
    "top_level": "adder",
    "simulator": 2,
    "language": 2,
    "module": "/home/carlos/repositorios/cocotbExamples/tools/cocotb/simple/test_adder.py",
    "files": [
        {
            "path": "/home/carlos/repositorios/cocotbExamples/hdl/adder.v"
        }
    ]
}

// var manager = new colibri.Simulators.Manager("localhost","8000");
// manager.runCocotb(example).then( respuesta => console.log(respuesta))

var manager = new colibri.Simulators.Manager("localhost","8000");
manager.getSuites().then( respuesta => console.log(respuesta[1]['simulators'][0]))
