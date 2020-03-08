// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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

class Icarus extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "iverilog ",
      'ERROR': /[\t\n ]*(.+){1}[\t]*.v:*([0-9]+):*[\t ]*(error):*[\t ]*([a-zA-Z \t0-9-:_.]+)/g,
      'TYPEPOSITION': 3,
      'ROWPOSITION': 2,
      'COLUMNPOSITION': 5,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = {
  Icarus: Icarus
}
