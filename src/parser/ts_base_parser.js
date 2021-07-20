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
const clone = require('clone');
const Doxygen_parser = require('./doxygen_parser');

class Ts_base_parser {
  constructor(){
      this.command_end_regex = /@end/gm;
  }

  search_multiple_in_tree(element, matching_title) {
    var arr_match = [];
    function recursive_searchTree(element, matching_title) {
      let type = element.type;
      if (type === matching_title) {
        arr_match.push(element);
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matching_title);
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matching_title);
    return arr_match;
  }

  search_in_tree(element, matching_title) {
    var match = undefined;
    function recursive_searchTree(element, matching_title) {
      let type = element.type;
      if (type === matching_title) {
        match = element;
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matching_title);
          if (result !== null) {
            break;
          }
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matching_title);
    return match;
  }

  get_item_multiple_from_childs(p, type) {
    if (p === undefined) {
      return [];
    }
    let items = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === type) {
        let item = cursor.currentNode();
        items.push(item);
      }
    }
    while (cursor.gotoNextSibling() === true);
    return items;
  }

  get_item_from_childs(p, type) {
    if (p === undefined) {
      return undefined;
    }
    let item = undefined;
    let cursor = p.walk();
    let break_p = false;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === type) {
        item = cursor.currentNode();
        break_p = true;
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return item;
  }

  parse_doxy(dic, file_type) {
    if (dic.info === undefined){
      dic.info = {};
    }
    // remove any spaces between linefeed and trim the string
    let desc_root = dic[file_type];
    // always remove carriage return
    desc_root.description = desc_root.description.replace(/\r/gm, "");
    // look for single line commands
    const single_line_regex = /^\s*[@\\](file|date|title|custom_section_begin|custom_section_end)\s.+$/gm;
    // get all matches for single line attributes
    let matches_array = Array.from(desc_root.description.matchAll(single_line_regex));
    // add a new property for the newly found matches
    if (matches_array.length > 0) {
      dic.info = {};
      // append found matches
      for (let index = 0; index < matches_array.length; index++) {
        dic.info[matches_array[index][1]] = matches_array[index][0].replace(/^\s*[@\\](file|date|title|custom_section_begin|custom_section_end)/, "").trim();
      }
      // clean up the description field
      desc_root.description = desc_root.description.replace(single_line_regex, "");
    }
    desc_root.description = desc_root.description.replace(/@copyright/gm, "\n@copyright");
    desc_root.description = desc_root.description.replace(/@author/gm, "\n@author");
    desc_root.description = desc_root.description.replace(/@version/gm, "\n@version");
    desc_root.description = desc_root.description.replace(/@project/gm, "\n@project");
    desc_root.description = desc_root.description.replace(/@brief/gm, "\n@brief");
    desc_root.description = desc_root.description.replace(/@details/gm, "\n@details");

    Doxygen_parser.parse_copyright(dic, desc_root);
    Doxygen_parser.parse_author(dic, desc_root);
    Doxygen_parser.parse_version(dic, desc_root);
    Doxygen_parser.parse_project(dic, desc_root);
    Doxygen_parser.parse_brief(dic, desc_root);
    Doxygen_parser.parse_details(dic, desc_root);
    return dic;
  }

  normalize_description(description){
    return description;
    let desc_inst = description.replace(/\n\s*\n/g, '<br>');
    desc_inst = desc_inst.replace(/\n/g, '');
    return desc_inst;
  }

  get_comment(comment){
    if (comment === undefined){
      return '';
    }
    let txt_comment = comment.slice(2);
    if (this.comment_symbol === '') {
      return txt_comment;
    }
    else if (txt_comment[0] === this.comment_symbol) {
      return txt_comment.slice(1);
    }
    return '';
  }

  set_symbol(symbol){
    if (symbol === undefined) {
      this.comment_symbol = '';
    }
    else{
      this.comment_symbol = symbol;
    }
  }

  parse_mermaid(dic,file_type) {
    // the command regex
    const mermaid_regex = /^\s*[@\\]mermaid\s*.*[@\\]end/gms;
    // a variable to hold if a mermaid is found and currently opened
    let mermaid_open = false;
    // easy access to the entity description
    let desc_root = dic[file_type];
    // hold the mermaid data
    let mermaid = "";
    // always remove carriage return
    desc_root.description = desc_root.description.replace(/\r/gm, "");
    let match = desc_root.description.match(mermaid_regex)
    if (match !== undefined && match !== null && match.length > 0) {
      desc_root.description = desc_root.description.replace(match[0],"");
      mermaid = match[0].replace(/[@\\]mermaid/gm,"")
      mermaid = mermaid.replace(/[@\\]end/gm,"")
      desc_root.description = desc_root.description.replace("\n\n","")
      dic[file_type]['description'] = desc_root.description
      dic[file_type]['mermaid'] = mermaid;
    }
    return dic;
  }

  parse_ports_group(dic) {
    
    const group_regex = /^\s*[@\\]portgroup\s.*$/gm;
    let ports = dic.ports;
    // hold the current group name
    let group_name = "";
    // flag to check if a group is open
    let group_open = false;
    // loop along all ports
    for (let i = 0; i < ports.length; i++) {
      let group = ports[i].description.match(group_regex);
      // look for a new group name
      if (group !== null && group.length > 0) {
        group_open = true;
        ports[i].description = ports[i].description.replace(/^\s*[@\\]portgroup\s/gm, "");
        group_name = ports[i].description.match(/^\s*\w+/)[0];
        ports[i].description = ports[i].description.replace(group_name, "");
      }

      ports[i].group = group_name;
    }
    dic.ports = ports;
    return dic;
  }
  parse_virtual_bus(dic) {
    const virtual_bus_regex_followed = /^\s*[@\\]virtualbus\s.*\n\n/gms;
    const virtual_bus_regex_not_followed = /^\s*[@\\]virtualbus\s.*/
    const virtual_bus_dir_regex = /^\s*[@\\]dir\s/gm;
    const virtual_bus_keep_regex = /^\s*[@\\]keepports\s/gm
    // the base struct is used to reset the virtual_bus_struct when needed
    const virtual_bus_base_struct = {
      "name": "",
      "description": "",
      "direction": "in",
      "keep_ports": false,
      "ports": []
    }
    let ports = dic.ports;
    // hold the indexes that gets removed from the ports list
    let ports_to_remove = [];
    // holds the current virtual bus and gets filled when a new one is encountered
    let virtual_bus_struct = clone(virtual_bus_base_struct);
    // holds all the found virtual buses found so for
    let virtual_bus_array = [];
    // indicates if a virtual bus is found in a port or not
    let virtual_bus_open = false;
    // loop along all ports
    for (let i = 0; i < ports.length; i++) {
      // strip description from \r if present to deal with \n exclusively
      ports[i].description = ports[i].description.replace(/\r/gm, "");

      let virtual_bus = ports[i].description.match(virtual_bus_regex_followed);

      if (virtual_bus === null) {
        virtual_bus = ports[i].description.match(virtual_bus_regex_not_followed);
      }

      if (virtual_bus !== null) {
        if (virtual_bus_open) {
          // new virtual bus is found and another one was still open, add the old one to the array and clean it
          virtual_bus_array.push(clone(virtual_bus_struct));
          virtual_bus_struct = clone(virtual_bus_base_struct);
        }
        let virtual_bus_description = virtual_bus[0];
        // clean the port description from the found virtual bus command
        dic.ports[i].description = ports[i].description.replace(virtual_bus_regex_not_followed, "");
        dic.ports[i].description = ports[i].description.replace(/\n\n/, "");
        dic.ports[i].description = ports[i].description.replace(this.command_end_regex, "");
        // strip virtual bus description from the command part
        virtual_bus_description = virtual_bus_description.replace(/^\s*[@\\]virtualbus\s/, "");
        // construct the name and description of virtual bus
        let virtual_bus_name = virtual_bus_description.match(/^\s*\w+/);
        if (virtual_bus_name !== null) {
          virtual_bus_name = virtual_bus_description.match(/^\s*\w+/)[0];
        }
        else {
          virtual_bus_name = "";
        }
        virtual_bus_description = virtual_bus_description.replace(virtual_bus_name, "");
        let virtual_bus_dir = virtual_bus_description.match(virtual_bus_dir_regex);
        // look for optional direction
        if (virtual_bus_dir !== null && virtual_bus_dir.length > 0) {
          virtual_bus_description = virtual_bus_description.replace(virtual_bus_dir[0], "");
          virtual_bus_description = virtual_bus_description.replace(/\n\n/, "");
          virtual_bus_dir = virtual_bus_description.match(/^\s*(out|in)/gm);
          if (virtual_bus_dir !== null) {
            virtual_bus_description = virtual_bus_description.replace(virtual_bus_dir[0], "");
            virtual_bus_struct.direction = virtual_bus_dir[0].trim();
          } else{
            virtual_bus_struct.direction = "in";
          }
        }
        // look for optional flag to keep in signals in table
        let keep_ports = virtual_bus_description.match(virtual_bus_keep_regex);
        // look for optional direction
        if (keep_ports !== null && keep_ports.length > 0) {
          virtual_bus_description = virtual_bus_description.replace(keep_ports[0], "");
          virtual_bus_struct.keep_ports = true;
        }
        // update the virtual bus struct with the newly found fields
        virtual_bus_struct.name = virtual_bus_name;
        virtual_bus_struct.description = virtual_bus_description;
        // keep the virtual bus opened to add incoming ports
        virtual_bus_open = true;
      }

      if (virtual_bus_open) {
        // copy the port to the newly created virtualbus
        virtual_bus_struct.ports.push(clone(ports[i]));
        // append current index to be removed
        ports_to_remove.push(clone(i))
      }
      // remove any added \n to description
      dic.ports[i].description = ports[i].description.replace(/\n/, "");

      if (ports[i].description.match(this.command_end_regex) !== null) {
        if (virtual_bus_open) {
          virtual_bus_open = false;
          for (let i = 0; i < virtual_bus_struct.ports.length; i++) {
            virtual_bus_struct.ports[i].description = virtual_bus_struct.ports[i].description.replace(this.command_end_regex, "");
          }
          virtual_bus_array.push(clone(virtual_bus_struct));
          virtual_bus_struct = clone(virtual_bus_base_struct);
        }
      }
    }
    if (virtual_bus_array.length > 0) {
      // append the vbus to the json
      dic.virtual_buses = virtual_bus_array;
      // remove ports from the list
      for (let index = 0; index < ports_to_remove.length; index++) {
        const element = ports_to_remove[index];
        dic.ports.splice(element - index, 1)
      }
      for (let index = 0; index < virtual_bus_array.length; index++) {
        const element = virtual_bus_array[index];
        dic.ports.push({
          "name": element.name,
          "type": "virtual_bus",
          "line": -1,
          "direction": element.direction,
          "default_value": "",
          "description": element.description,
          "group": ""
        });
      }
    }
    return dic;
  }

}

module.exports = {
  Ts_base_parser: Ts_base_parser
};