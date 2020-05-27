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
const Base_linter = require('./base_linter')

class Ghdl extends Base_linter {
  constructor(path) {
    super(path);
    this.PARAMETERS = {
      'SYNT' : "ghdl -s -fno-color-diagnostics",
      'ERROR' : /[\t\n ]*(.+){1}[\t]*.vhd:*([0-9]+):([0-9]+):*[\t ]*(error|warning)*:*[\t ]*(.+)/g,
      'TYPEPOSITION': 4,
      'ROWPOSITION': 2,
      'COLUMNPOSITION': 3,
      'DESCRIPTIONPOSITION': 5,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = {
  Ghdl: Ghdl
}
