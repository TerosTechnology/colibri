// Copyright 2020-2021 Teros Technology
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

function get_lang_from_extension(extension){
  const vhdl_type = ['.vhd', '.vho', '.vhdl'];
  const verilog_type = ['.v', '.vh', '.vl'];
  const system_verilog_type = ['.sv', '.svh'];

  if (vhdl_type.includes(extension) === true){
    return 'vhdl';
  }
  else if(verilog_type.includes(extension) === true){
    return 'verilog';
  }
  else if (system_verilog_type.includes(extension) === true){
    return 'systemverilog';
  }
  else{
    return 'none';
  }
}

function get_lang_from_path(file_path){
  const path = require('path');
  let extension = path.extname(file_path).toLowerCase();
  let lang = get_lang_from_extension(extension);
  return lang;
}

module.exports = {
  get_lang_from_path : get_lang_from_path,
  get_lang_from_extension: get_lang_from_extension
};