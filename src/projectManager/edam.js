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

function json_edam_to_yml_edam(json_data){
  const json2yaml = require('./json2yaml').json2yaml;
  let yaml = json2yaml(json_data);
  return yaml;
}

function yml_edam_str_to_json_edam(yml_str){
  const yaml = require('js-yaml');
  let json_data = yaml.load(yml_str);
  return json_data;
}


module.exports = {
  json_edam_to_yml_edam: json_edam_to_yml_edam,
  yml_edam_str_to_json_edam : yml_edam_str_to_json_edam
};