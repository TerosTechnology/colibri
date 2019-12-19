//TODO: regular la tabulación.
//TODO: estandarizar ports y genrics.
const Codes = require('./codes')

function createTestbench(structure, options) {
  var vunit = false;
  if (options != null){
    vunit = options['type'] == Codes.TYPESTESTBENCH.VUNIT
  }
  var space = '  ';
  var str = '';
  str += setLibraries(structure['libraries']);
  str += '\n'
  if (vunit == true) {
    str += setVunitLibraries();
    str += '\n'
  }
  if (vunit == true) {
    str += setVunitEntity(structure['entity']);
    str += '\n'
  } else {
    str += setEntity(structure['entity']);
    str += '\n'
  }
  str += '\n'
  str += setArchitecture(structure['architecture'], structure['entity']);
  str += '\n'
  if (vunit === false) {
    str += setComponent(space, structure['entity']['name'], structure['generics'],
      structure['ports']);
  }
  str += '\n'
  str += setConstants(space, structure['generics']);
  str += '\n'
  str += '  -- Ports\n';
  str += setSignals(space, structure['ports']);
  str += '\n'
  str += 'begin\n'
  str += '\n'
  str += setInstance(space, structure['entity']['name'], structure['generics'], structure['ports'], vunit);
  str += '\n'
  if (vunit == true) {
    str += setVunitProcess(space);
    str += '\n'
  }
  str += setClkProcess(space);
  str += '\n'
  str += 'end;\n'

  return str;
}

function setVunitLibraries() {
  var str = '';
  str += 'library src_lib;\n'
  str += '--\n';
  str += 'library vunit_lib;\n';
  str += 'context vunit_lib.vunit_context;\n';
  str += '-- use vunit_lib.array_pkg.all;\n';
  str += '-- use vunit_lib.lang.all;\n';
  str += '-- use vunit_lib.string_ops.all;\n';
  str += '-- use vunit_lib.dictionary.all;\n';
  str += '-- use vunit_lib.path.all;\n';
  str += '-- use vunit_lib.log_types_pkg.all;\n';
  str += '-- use vunit_lib.log_special_types_pkg.all;\n';
  str += '-- use vunit_lib.log_pkg.all;\n';
  str += '-- use vunit_lib.check_types_pkg.all;\n';
  str += '-- use vunit_lib.check_special_types_pkg.all;\n';
  str += '-- use vunit_lib.check_pkg.all;\n';
  str += '-- use vunit_lib.run_types_pkg.all;\n';
  str += '-- use vunit_lib.run_special_types_pkg.all;\n';
  str += '-- use vunit_lib.run_base_pkg.all;\n';
  str += '-- use vunit_lib.run_pkg.all;\n';
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
  str += 'entity ' + m['name'] + '_tb is\n';
  str += 'end;\n';
  return str;
}

function setVunitEntity(m) {
  var str = '';
  str += 'entity ' + m['name'] + '_tb is\n';
  str += '  generic (runner_cfg : string);\n';
  str += 'end;\n';
  return str;
}

function setArchitecture(m, n) {
  var str = '';
  str += 'architecture bench of ' + n['name'] + '_tb is\n';
  return str;
}

function setConstants(space, m) {
  var str = '';
  str += space + '-- Clock period\n';
  str += space + 'constant clk_period : time := 5 ns;\n';
  str += space + '-- Generics\n';
  for (const x in m) {
    str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + ';\n';
  }
  return str;
}

function setSignals(space, m) {
  var str = '';
  for (const x in m) {
    str += space + 'signal ' + m[x]['name'] + ' : ' + m[x]['type'] + ';\n';
  }
  return str;
}

function setComponent(space, name, generics, ports) {
  var str = '';
  //Component name
  str += space + 'component ' + name + '\n';
  //Generics
  if (generics.length > 0) {
    str += space + '  generic (\n';
    for (let x = 0; x < generics.length - 1; ++x) {
      str += space + '    ' + generics[x]['name'] + ' : ' + generics[x]['type'] + ';\n';
    }
    str += space + '    ' + generics[generics.length - 1]['name'] + ' : ' +
      generics[generics.length - 1]['type'] + '\n';
    str += space + '  );\n'
  }
  //Ports
  if (ports.length > 0) {
    str += space + '  port (\n';
    for (let x = 0; x < ports.length - 1; ++x) {
      str += space + '    ' + ports[x]['name'] + ' : ' + ports[x]['direction'] + ' ' +
        ports[x]['type'] + ';\n';
    }
    str += space + '    ' + ports[ports.length - 1]['name'] + ' : ' +
      ports[ports.length - 1]['direction'] + ' ' +
      ports[ports.length - 1]['type'] + '\n';
    str += space + '  );\n'
  }
  //End component
  str += space + 'end component;\n';

  return str;
}

function setInstance(space, name, generics, ports, vunit) {
  var str = '';
  //Instance name
  if (vunit === true) {
    str += space + name + '_inst : entity src_lib.' + name + '\n';
  } else {
    str += space + name + '_inst : ' + name + '\n';
  }
  //Generics
  if (generics.length > 0) {
    str += space + '  generic map (\n';
    for (let x = 0; x < generics.length - 1; ++x) {
      str += space + '    ' + generics[x]['name'] + ' => ' + generics[x]['name'] + ',\n';
    }
    str += space + '    ' + generics[generics.length - 1]['name'] + ' => ' + generics[generics.length - 1]['name'] + '\n';
    str += space + '  )\n'
  }
  //Ports
  if (ports.length > 0) {
    str += space + '  port map (\n';
    for (let x = 0; x < ports.length - 1; ++x) {
      str += space + '    ' + ports[x]['name'] + ' => ' + ports[x]['name'] + ',\n';
    }
    str += space + '    ' + ports[ports.length - 1]['name'] + ' => ' + ports[ports.length - 1]['name'] + '\n';
    str += space + '  );\n';
  }
  return str;
}

function setVunitProcess(space) {
  var str = '';
  str += space + 'main : process\n';
  str += space + 'begin\n';
  str += space + '  test_runner_setup(runner, runner_cfg);\n';
  str += space + '  while test_suite loop\n';
  str += space + '    if run("test_alive") then\n';
  str += space + '      info("Hello world test_alive");\n';
  str += space + '      wait for 100 ns;\n';
  str += space + '      test_runner_cleanup(runner);\n';
  str += space + '      \n';
  str += space + '    elsif run("test_0") then\n';
  str += space + '      info("Hello world test_0");\n';
  str += space + '      wait for 100 ns;\n';
  str += space + '      test_runner_cleanup(runner);\n';
  str += space + '    end if;\n';
  str += space + '  end loop;\n';
  str += space + 'end process main;\n';
  return str;
}

function setClkProcess(space) {
  var str = '';
  str += '-- ' + space + "clk_process : process\n";
  str += '-- ' + space + "begin\n";
  str += '-- ' + space + "  clk <= '1';\n";
  str += '-- ' + space + "  wait for clk_period/2;\n";
  str += '-- ' + space + "  clk <= '0';\n";
  str += '-- ' + space + "  wait for clk_period/2;\n";
  str += '-- ' + space + "end process clk_process;\n";
  return str;
}

function createComponent(structure, options) {
  if (options == null)
    return "";
  var component = "";
  if (options['type'] == Codes.TYPESCOMPONENTS.COMPONENT) {
    component = setComponent('  ', structure['entity']['name'],
      structure['generics'], structure['ports'], false);
  } else if (options['type'] == Codes.TYPESCOMPONENTS.INSTANCE) {
    component = setInstance('  ', structure['entity']['name'],
      structure['generics'], structure['ports'], false);
  } else if (options['type'] == Codes.TYPESCOMPONENTS.SIGNALS) {
    component = setSignals('  ', structure['ports']);
  }
  else{
    console.log("error")
  }
  return component;
}

//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  createTestbench: createTestbench,
  createComponent: createComponent,
}
