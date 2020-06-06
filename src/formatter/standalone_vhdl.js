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

const Vhdl_formatter = require('./bin/standalone_vhdl/beautifuler');

class Standalone_vhdl {
  constructor() {
  }

  //Options: {custom_path:"/path/to/bin, custom_bin:"bin", settings:""}
  async format_from_code(code,options){
    let beautifuler = new Vhdl_formatter.Beautifuler();
    let formatted_code = beautifuler.beauty(code,options.settings);
    return formatted_code;
  }
}

module.exports = {
  Standalone_vhdl: Standalone_vhdl
};