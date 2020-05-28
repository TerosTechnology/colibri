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

const general = require('../general/general')
const tsVerilogParser = require('./tsVerilogParser')
const vunitVhdlParser = require('./vunitVhdlParser')

class ParserFactory {
  constructor() {}

  getParser(lang,comment_symbol) {
    if (lang == 'vhdl') {
      return this.getVhdlParser(comment_symbol);
    } else if (lang == 'verilog') {
      return this.getVerilogParser(comment_symbol);
    }
  }

  getVhdlParser(comment_symbol) {
    return new vunitVhdlParser(comment_symbol);
  }

  getVerilogParser(comment_symbol) {
    return new tsVerilogParser(comment_symbol);
  }
}

module.exports = {
  ParserFactory: ParserFactory
}
