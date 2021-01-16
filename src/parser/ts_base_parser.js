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

class Ts_base_parser {

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

  parse_doxy(dic,file_type) {
    // remove any spaces between linefeed and trim the string
    let desc_root = dic[file_type];
    desc_root.description = desc_root.description.trim().replace(/\n\s/gm, "\n")
    // look for single line commands
    const single_line_regex = /^\s*[@\\](file|author|version|date)\s.+$/gm;
    // get all matches for single line attributes
    let matches_array = Array.from(desc_root.description.matchAll(single_line_regex));
    // add a new property for the newly found matches
    if (matches_array.length > 0) {
      dic.info = {};
      // append found matches
      for (let index = 0; index < matches_array.length; index++) {
        dic.info[matches_array[index][1]] = matches_array[index][0].replace(/^\s*[@\\](file|author|version|date)/,"").trim();
      }
      // clean up the description field
      desc_root.description = desc_root.description.replace(single_line_regex, "");
    }
    // look for copyrights regex
    const copyright_regex = /^\s*[@\\]copyright\s(?:(?![\\@$]).)*/gms;
    let copyright = desc_root.description.match(copyright_regex);
    if (copyright !== null) {
      let stripped_copyright = copyright[0].split(/(\r\n[\s]*\r\n)|(\n[\s]*\n)/gm);
      for (let index = 0; index < stripped_copyright.length; index++) {
        if (stripped_copyright[index] !== undefined && stripped_copyright[index].match(copyright_regex) !== null){
          dic.info.copyright = stripped_copyright[index].replace(/^\s*[@\\]copyright\s/,"");
          desc_root.description = desc_root.description.replace(stripped_copyright[index],"");
        }
        
      }
    }
    // clean @details and @brief and create the new description
    const description_regex = /^\s*[@\\](brief|details)\s/gm;
    desc_root.description = desc_root.description.replace(description_regex,"");
    desc_root.description = desc_root.description.replace(/(\r\n[\s]*\r\n)|(\n[\s]*\n)/gm,"");
    dic[file_type] = desc_root;
    if (file_type === "entity"){
      let processes_list = dic['body']['processes']
      if (processes_list.length > 0){
        for (let i = 0; i < processes_list.length; i++) {
          dic.body.processes[i].description = dic.body.processes[i].description.replace(description_regex,"");
        }
      }
    }
    return dic
  }


  parse_virtual_bus(dic) {
    const virtual_bus_regex = /(^\s*[@\\]virtualbus\s)(?:(?![$]).)*/gm;
    const virtual_bus_end_regex = /^\s*[@\\]endvirtualbus\s*/gm;
    const virtual_bus_dir_regex = /^\s*[@\\]dir\s/gm;
    // the base struct is used to reset the virtual_bus_struct when needed
    const virtual_bus_base_struct = {
      "name" : "",
      "description" : "",
      "direction" : "in",
      "ports" : []
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
      let virtual_bus =  Array.from(ports[i].description.matchAll(virtual_bus_regex));
  
      if (virtual_bus.length > 0){
        if (virtual_bus_open){
          // new virtual bus is found and another one was still open, add the old one to the array and clean it 
          virtual_bus_array.push(clone(virtual_bus_struct));
          virtual_bus_struct = clone(virtual_bus_base_struct);
        }
        let virtual_bus_description = virtual_bus[0][0];
        // clean the port description from the found virtual bus command
        dic.ports[i].description = ports[i].description.replace(virtual_bus[0][0],"");
        dic.ports[i].description = ports[i].description.replace(virtual_bus_end_regex,"");
        // strip virtual bus description from the command part
        virtual_bus_description = virtual_bus_description.replace(virtual_bus[0][1],"");
        // construct the name and description of virtual bus
        let virtual_bus_name = virtual_bus_description.match(/^\s*\w+/)[0]
        virtual_bus_description = virtual_bus_description.replace(virtual_bus_name,"");
        let virtual_bus_dir = virtual_bus_description.match(virtual_bus_dir_regex);
        // look for optional direction
        if (virtual_bus_dir !== null && virtual_bus_dir.length > 0){
          virtual_bus_description = virtual_bus_description.replace(virtual_bus_dir[0],"");
          virtual_bus_dir = virtual_bus_description.match(/^\s*(out|in)/gm);
          if (virtual_bus_dir.length > 0){
            virtual_bus_description = virtual_bus_description.replace(virtual_bus_dir[0],"");
          }
          virtual_bus_struct.direction = virtual_bus_dir[0].trim();
        }
        // update the virtual bus struct with the newly found fields
        virtual_bus_struct.name = virtual_bus_name;
        virtual_bus_struct.description = virtual_bus_description;
        // keep the virtual bus opened to add incoming ports
        virtual_bus_open = true;
      } else if (virtual_bus.length == 0 && virtual_bus_open){
        // check for closing command
        if (ports[i].description.match(virtual_bus_end_regex) !== null) {
          dic.ports[i].description = ports[i].description.replace(virtual_bus_end_regex,"");
          virtual_bus_open = false;
          virtual_bus_array.push(clone(virtual_bus_struct));
          virtual_bus_struct = clone(virtual_bus_base_struct);
        }
      }
      if (virtual_bus_open){
        // copy the port to the newly created virtualbus
        virtual_bus_struct.ports.push(clone(ports[i]));
        // append current index to be removed
        ports_to_remove.push(clone(i))
      }
    }
    if (virtual_bus_array.length > 0) {
      // append the vbus to the json 
      dic.virtual_buses = virtual_bus_array;
      // remove ports from the list
      for (let index = 0; index < ports_to_remove.length; index++) {
        const element = ports_to_remove[index];
        dic.ports.splice(element-index,1)
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
        });
      } 
    }
    return dic;
  }

}

module.exports = {
  Ts_base_parser: Ts_base_parser
};