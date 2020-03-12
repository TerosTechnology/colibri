// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

const BaseLinter = require('./linter')

class Verilator extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "verilator --lint-only -bbox-sys --bbox-unsup -DGLBL ",
      'ERROR': /%(Error|Warning)*-*[^:\n]*:{1}[\t ]*([^:\n]+){1}[\t ]*:{1}[\t ]*([0-9]+){1}[\t ]*:{1}[\t ]*(.+)/g,
      'TYPEPOSITION': 1,
      'ROWPOSITION': 3,
      'COLUMNPOSITION': 6,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = {
  Verilator: Verilator
}
