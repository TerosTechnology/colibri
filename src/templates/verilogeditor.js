//TODO: regular la tabulación.
//TODO: estandarizar ports y genrics.
//TODO: versión
//TODO: vunit
const General = require('../general/general')

function createTestbench(structure, options) {
  var vunit = options['type'] == "vunit"
  var version = options['version'];
  var space = '  ';
  var str = '';
  // str += setLibraries(structure['libraries']);
  // str += '\n'
  if (vunit == true) {
    str += setVunitLibraries();
    str += '\n'
  }
  str += setEntity(structure['entity']);
  str += '\n'
  str += setConstants(space, structure['generics']);
  str += '\n'
  str += '  // Ports\n';
  str += setSignals(space, structure['ports']);
  str += '\n'

  if (version == General.VERILOGSTANDARS.VERILOG2001) {
    str += setInstance2001(space, structure['entity']['name'], structure['generics'], structure['ports']);
  } else {
    str += setInstance(space, structure['entity']['name'], structure['generics'], structure['ports']);
  }
  str += '\n'
  if (vunit == true) {
    str += setVunitProcess(space);
    str += '\n'
  } else {
    str += setMain(space);
    str += '\n'
  }
  str += setClkProcess(space);
  str += '\n'
  str += 'endmodule\n'

  return str;
}

function setVunitLibraries() {
  var str = '';
  str += '`include "vunit_defines.svh"\n';
  return str;
}

function setLibraries(m) {
  var str = '';
  for (const x in m) {
    str += 'use ' + m[x]['name'] + ';\n';
  }
  return str;
}

function setEntity(m) {
  var str = '';
  str += 'module ' + m['name'] + '_tb;\n';
  return str;
}

function setVunitEntity(m) {
  var str = '';
  str += 'entity ' + m['name'] + '_tb is\n';
  str += '  generic (runner_cfg : string);\n';
  str += 'end;\n';
  return str;
}

function setConstants(space, m) {
  var str = '';
  str += space + '// Parameters\n';
  for (const x in m) {
    str += space + 'localparam ' + m[x]['type'] + ' ' + m[x]['name'] + ';\n';
  }
  return str;
}

function setSignals(space, m) {
  var str = '';
  for (const x in m) {
    str += space + 'reg ' + m[x]['type'] + ' ' + m[x]['name'] + ';\n';
  }
  return str;
}

function setInstance(space, name, generics, ports) {
  var str = '';
  //Instance name
  str += space + name + '\n';
  //Parameters
  if (generics.length > 0) {
    str += space + '  #(\n';
    for (let x = 0; x < generics.length - 1; ++x) {
      str += space + '    ' + generics[x]['name'] + ',\n';
    }
    str += space + '    ' + generics[generics.length - 1]['name'] + '\n';
    str += space + '  )\n'
  }
  //Ports
  if (ports.length > 0) {
    str += space + name + '_dut (\n';
    for (let x = 0; x < ports.length - 1; ++x) {
      str += space + '    ' + ports[x]['name'] + ',\n';
    }
    str += space + '    ' + ports[ports.length - 1]['name'] + '\n';
    str += space + '  );\n';
  }
  return str;
}

function setInstance2001(space, name, generics, ports) {
  var str = '';
  //Instance name
  str += space + name + '\n';
  //Parameters
  if (generics.length > 0) {
    str += space + '  #(\n';
    for (let x = 0; x < generics.length - 1; ++x) {
      str += space + '    .' + generics[x]['name'] + '(' + generics[x]['name'] + '),\n';
    }
    str += space + '    .' + generics[generics.length - 1]['name'] + ' (' + generics[generics.length - 1]['name'] + ')\n';
    str += space + '  )\n'
  }
  //Ports
  if (ports.length > 0) {
    str += space + name + '_dut (\n';
    for (let x = 0; x < ports.length - 1; ++x) {
      str += space + '    .' + ports[x]['name'] + ' (' + ports[x]['name'] + '),\n';
    }
    str += space + '    .' + ports[ports.length - 1]['name'] + ' (' + ports[ports.length - 1]['name'] + ')\n';
    str += space + '  );\n';
  }
  return str;
}

function setVunitProcess(space) {
  var str = '';
  str += space + '`TEST_SUITE begin\n';
  str += space + '  // It is possible to create a basic test bench without any test cases\n';
  str += space + '  $display("Hello world");\n';
  str += space + 'end\n';
  return str;
}

function setMain(space) {
  var str = '';
  str += space + "initial begin\n";
  str += space + "begin\n";
  str += space + "  $finish;\n";
  str += space + "end\n";
  return str;
}

function setClkProcess(space) {
  var str = '';
  str += '// ' + space + "always\n";
  str += '// ' + space + "  #5  clk =  ! clk;\n";
  return str;
}

function createComponent(structure, options) {
  // let option = {
  //   'language' : "vhdl",
  //   'version'  : "2008",
  //   'type' : "normal",
  //   'parameters' : [
  //     {'parameter' : "X"},
  //     {'parameter' : "Y"},
  //   ]
  // }
  var component = "";
  if (options['type'] == "component") {
    component = "";
  } else if (options['type'] == "instance") {
    component = setInstance2001('  ', structure['entity']['name'],
      structure['generics'], structure['ports'], false);
  } else if (options['type'] == "signals") {
    component = setSignals('  ', structure['ports']);
  }
  return component;
}


//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  createTestbench: createTestbench,
  createComponent: createComponent
}
