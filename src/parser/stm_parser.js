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

const stm_vhdl = require('./vhdl_sm');
const stm_verilog = require('./verilog_sm');
const General = require('../general/general');

async function get_svg_sm(language, code, comment_symbol) {
  if (language === General.LANGUAGES.VHDL) {
    let parser = new stm_vhdl.Paser_stm_vhdl(comment_symbol);
    await parser.init();
    let stm = await parser.get_svg_sm(code, comment_symbol);
    return await stm;
  }
  else if (language === General.LANGUAGES.VERILOG || language === General.LANGUAGES.SYSTEMVERILOG) {
    let parser = new stm_verilog.Paser_stm_verilog(comment_symbol);
    await parser.init();
    let stm = await parser.get_svg_sm(code, comment_symbol);
    return await stm;
  }
}

module.exports = {
  get_svg_sm: get_svg_sm
};
