var Languagues = {
  VHDL: 'vhdl',
  VERILOG: 'verilog'
};

var Standards = {
  VHDL2008: 'vhdl08',
  VERILOG2001: 'verilog01'
};

var Parsers = {
  VHDL: 'vhdl_parser',
  VERILOG: 'verilog_parser'
};

var Linters = {
  GHDL: 'ghdl',
  ICARUS: 'icarus',
  MODELSIM: 'modelsim',
  VERILATOR: 'verilator'
};

var Editors = {
  VHDL: 'vhdl_editor',
  VERILOG: 'verilog_editor'
}

var Documenters = {
  VHDL: 'vhdl_documenter',
  VERILOG: 'verilog_documenter'
}

module.exports = {
  Languagues,
  Standards,
  Parsers,
  Linters,
  Editors,
  Documenters
}
