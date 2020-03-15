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
