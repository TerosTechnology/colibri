// Copyright 2021 Teros Technology
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
    
class Markdown {

  _get_info_section(code_tree){
    let markdown_doc = "";
    //Doxygen parsed commands insertion (only if available)
    if (code_tree['info'] !== undefined){
      if (code_tree['info']['file'] !== undefined){
        markdown_doc += "- **File:** " + code_tree['info']['file'] + "\n";
      }
      if (code_tree['info']['author'] !== undefined){
        markdown_doc += "- **Author:** " + code_tree['info']['author'] + "\n";
      }
      if (code_tree['info']['version'] !== undefined){
        markdown_doc += "- **Version:** " + code_tree['info']['version'] + "\n";
      }
      if (code_tree['info']['date'] !== undefined){
        markdown_doc += "- **Date:** " + code_tree['info']['date'] + "\n";
      }
      if (code_tree['info']['copyright'] !== undefined){
        markdown_doc += "- **Copyright:** " + code_tree['info']['copyright'] + "\n";
      }
    }
    return markdown_doc;
  }
  _get_in_out_section(ports, generics,virtual_buses) {
    if (generics.length === 0 && ports.length === 0){
      return '';
    }
    let md = "";
    if (generics.length !== 0) {
      md += "## Generics\n";
      md += this._get_doc_generics(generics);
    }
    if (ports.length !== 0) {
      md += `## Ports\n`;
      if (virtual_buses !== undefined) {
        let virtual_buses_to_add = virtual_buses.filter(obj => obj.keep_ports === true);
        if (virtual_buses_to_add.length > 0) {
          for (let i = 0; i < virtual_buses_to_add.length; i++) {
            const element = virtual_buses_to_add[i];
            ports = ports.filter(function(value, index, arr){ 
              return value.name !== element.name;
          });
          ports = ports.concat(element.ports);
          }
        }
      }
      md += this._get_doc_ports(ports);
    }
    if (virtual_buses !== undefined) {
      let virtual_buses_to_show = virtual_buses.filter(obj => obj.keep_ports === false);
      if (virtual_buses_to_show.length > 0) {
        md += "### 1.3 Virtual Buses\n";
        for (let i = 0; i < virtual_buses_to_show.length; i++) {
          const element = virtual_buses_to_show[i];
          md += "### Table 1.3."+(i+1).toString()+" "+ element.name+"\n";
          md += this._get_doc_ports(element.ports);
        }
      }
    }
    return md;
  }

  _get_elements_with_description(elements) {
    let elements_i = [];
    for (let i = 0; i < elements.length; ++i) {
      let description = elements[i].description.replace(/ /g, '').replace(/\n/g, '');
      if (description !== '') {
        elements_i.push(elements[i]);
      }
    }
    return elements_i;
  }

  _get_signals_constants_section(signals, constants, types) {
    let md = "";

    if (this.config.signals === 'commented') {
      signals = this._get_elements_with_description(signals);
    }
    if (this.config.constants === 'commented') {
      constants = this._get_elements_with_description(constants);
      types = this._get_elements_with_description(types);
    }

    if ((signals.length !== 0 && this.config.signals !== 'none') ||
      (constants.length !== 0 && this.config.constants !== 'none') || 
      (types.length !== 0 && this.config.constants !== 'none')) {
      //Tables
      if (signals.length !== 0 && this.config.signals !== 'none') {
        md += "## Signals\n";
        md += this._get_doc_signals(signals);
      }
      if (constants.length !== 0 && this.config.constants !== 'none') {
        md += "## Constants\n";
        md += this._get_doc_constants(constants);
      }
      if (types.length !== 0 && this.config.constants !== 'none') {
        md += "## Types\n";
        md += this._get_doc_types(types);
      }
    }
    return md;
  }

  _get_process_section(process) {
    if (this.config.process === 'none') {
      return '';
    }
    if (this.config.process === 'commented') {
      process = this._get_elements_with_description(process);
    }
    let md = "";
    if (process.length !== 0) {
      //Title
      md += "## Processes\n";
      for (let i = 0; i < process.length; ++i) {
        md += `- ${process[i].name}: _( ${process[i].sens_list} )_\n`;
        md += `${process[i].description}\n`;
        let description = process[i].description;
        if (description !== ''){
          md += '**Description**\n';
          md += `${process[i].description}\n`;
        }
      }
    }
    return md;
  }

  _get_functions_section(functions) {
    let md = "";
    if (this.config.functions === 'none') {
      return '';
    }
    if (functions.length !== 0) {
      //Title
      md += "## Functions\n";
      for (let i = 0; i < functions.length; ++i) {
        if (functions[i].name !== ''){
          let arguments_str = functions[i].arguments;
          if (arguments_str === ''){
            arguments_str = '()';
          }
          let return_str = functions[i].return;
          if (return_str === ''){
            return_str = 'return ()';
          }
          // eslint-disable-next-line max-len
          md += `- ${functions[i].name} <font id="function_arguments">${arguments_str}</font> <font id="function_return">${return_str}</font>\n`;
          let description = functions[i].description;
          if (description !== ''){
            md += '**Description**\n';
            md += `${functions[i].description}\n`;
          }
        }
      }
    }
    return md;
  }

  _get_instantiations_section(instantiations) {
    let md = "";
    if (instantiations.length !== 0) {
      //Title
      md += "## Instantiations\n";
      for (let i = 0; i < instantiations.length; ++i) {
        md += `- ${instantiations[i].name}: ${instantiations[i].type}\n`;
        let description = instantiations[i].description;
        if (description !== ''){
          md += '**Description**\n';
          md += `${instantiations[i].description}\n`;
        }
      }
    }
    return md;
  }

  _get_doc_ports(ports) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Port name", "Direction", "Type", "Description"]);
    for (let i = 0; i < ports.length; ++i) {
      let direction = ports[i]['direction'].replace(/\r/g, ' ').replace(/\n/g, ' ')
      if (ports[i]['type'] === "virtual_bus"){
        direction = "-";
      }
      table.push([ports[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      direction,
      ports[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      ports[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_generics(generics) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Generic name", "Type", "Value", "Description"]);
    for (let i = 0; i < generics.length; ++i) {
      table.push([generics[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['default_value'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_signals(signals) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Description"]);
    for (let i = 0; i < signals.length; ++i) {
      table.push([signals[i]['name'],
      signals[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      signals[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_constants(constants) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Value", "Description"]);
    for (let i = 0; i < constants.length; ++i) {
      table.push([constants[i]['name'],
      constants[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      constants[i]['default_value'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      constants[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_types(tpyes) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Description"]);
    for (let i = 0; i < tpyes.length; ++i) {
      table.push([tpyes[i]['name'],
      tpyes[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      tpyes[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

}

module.exports = {
  Markdown: Markdown
};