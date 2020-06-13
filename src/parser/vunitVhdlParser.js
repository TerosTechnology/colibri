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

const path  = require('path');

class VhdlParser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }

  getAll(str) {
    let path_python = __dirname + path.sep + "parser.py"
    str = str.replace(/"/g,'\\"');
    str = str.replace(/`/g,'\\`');
    const MAX_ARG_LENGTH = 32767;
    let reduce_str = str.slice(0,MAX_ARG_LENGTH);

    let cmd = "python " + path_python + ' "' + this.comment_symbol + '" ' + ' "' + reduce_str + ' "';
    let structure = undefined;
    try {
      const execSync = require('child_process').execSync;
      let stdout = execSync(cmd).toString();
      structure = JSON.parse(stdout);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-console
      console.error("Error parsing.");
    }
    return structure;
  }
}

module.exports =  VhdlParser;
