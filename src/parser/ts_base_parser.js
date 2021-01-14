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
    let dic_copy = dic;
    let desc_root = dic_copy[file_type];
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
    dic_copy[file_type] = desc_root;
    return dic_copy
  }

}

module.exports = {
  Ts_base_parser: Ts_base_parser
};