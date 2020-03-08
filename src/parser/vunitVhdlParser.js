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

const shell = require('child_process');
const path  = require('path');

class VhdlParser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol
  }

  getAll(str) {
    var path_python = __dirname + path.sep + "parser.py"
    str = str.replace(/"/g,'\\"');
    var cmd = "python3 " + path_python + ' "' + this.comment_symbol + '" ' + ' "' + str + ' "';
    const execSync = require('child_process').execSync;
    var stdout = execSync(cmd).toString();
    var structure = JSON.parse(stdout);
    return structure;
  }
}

module.exports =  VhdlParser
