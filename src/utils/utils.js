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

const path_lib = require("path");
const fs = require("fs");
const Parser = require('../parser/factory');

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

function check_if_hdl_file(file_path){
  let lang = get_lang_from_path(file_path);
  let check = false;
  if (lang === 'verilog' || lang === 'vhdl' || lang === 'systemverilog'){
    check = true;
  }
  return check;
}

function del_comments_vhdl(content) {
  let l_comment = new RegExp([
    /--.*/
  ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
  let b_comment = new RegExp([
    /\*[\s\S]*?\*\//
  ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');

  let match = content.match(b_comment);
  if (match != null) {
      for (let i = 0; i < match.length; i++) {
          const element = match[i];
          const newElement = element.replace(/\S/g,' ');
          content = content.replace(element,newElement);
      }
  }
  match = content.match(l_comment);
  if (match != null) {
      for (let i = 0; i < match.length; i++) {
          const element = match[i];
          const newElement = element.replace(/\S/g,' ');
          content = content.replace(element,newElement);
      }
  }
  return content;
}

function del_comments_verilog(content) {
  let l_comment = new RegExp([
    /\/\/.*/].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
  var b_comment = new RegExp([
      /\/\*[\s\S]*?\*\//].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
      let match = content.match(b_comment);
  if (match != null) {
      for (let i = 0; i < match.length; i++) {
          const element = match[i];
          const newElement = element.replace(/\S/g,' ');
          content = content.replace(element,newElement);
      }
  }
  match = content.match(l_comment);
  if (match != null) {
      for (let i = 0; i < match.length; i++) {
          const element = match[i];
          const newElement = element.replace(/\S/g,' ');
          content = content.replace(element,newElement);
      }
  }
  return content;
}

function get_toplevel_regex(code, lang){
  if (code === undefined){
    return '';
  }
  let result;
  let regex;
  if (lang === 'vhdl'){
    code = del_comments_vhdl(code);
    regex = /(entity|pacakge)\s+(?<name>\w+)\s*is\s*/gim;
    result = regex.exec(code)
    if (result !== undefined && result.length >= 3){
      return result[2];
    }
  }
  else{
    //Remove comments
    code = del_comments_verilog(code);
    regex = /(?<type>module|program|interface|package|primitive|config|property)\s+(?:automatic\s+)?(?<name>\w+)/gm;
    result = regex.exec(code)
    if (result !== undefined && result.length >= 3){
      return result[2];
    }
    return 
  }
}



async function get_toplevel_from_path(filepath){
  if (filepath === undefined){
    return '';
  }
  if (fs.existsSync(filepath) === false){
    return '';
  }  
  let lang = get_file_lang(filepath);
  // let parser_factory = new Parser.ParserFactory();
  // let parser = await parser_factory.getParser(lang);

  let code = fs.readFileSync(filepath, "utf8");
  // let entity_name = await parser.get_only_entity_name(code);
  let entity_name = '';
  entity_name = get_toplevel_regex(code,lang);

  if (entity_name === undefined){
    return '';
  }
  return entity_name;
}

function get_file_lang(filepath){
  let vhdl_extensions = ['.vhd', '.vho', '.vhdl', '.vhd'];
  let verilog_extensions = ['.v', '.vh', '.vl', '.sv', '.svh'];
  let extension = path_lib.extname(filepath).toLowerCase();
  let lang = 'vhdl';
  if (vhdl_extensions.includes(extension) === true){
    lang = 'vhdl';
  }
  else if(verilog_extensions.includes(extension) === true){
    lang = 'verilog';
  }
  else{
      lang = 'none';
  }
  return lang;
}

module.exports = {
  get_file_lang:get_file_lang,
  get_toplevel_from_path:get_toplevel_from_path,
  check_if_hdl_file : check_if_hdl_file,
  get_lang_from_path : get_lang_from_path,
  get_lang_from_extension: get_lang_from_extension
};