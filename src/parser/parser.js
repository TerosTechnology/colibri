// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

class BaseParser {
  constructor() {
    this.REGEX = {};
  }

  getConstants(str) {
    return this.getItem(str, 0, this.REGEX['CONSTANT']);
  }

  getLibraries(str) {
    var items = []
    var result = this.REGEX['LIBRARY'].exec(str);
    while (result) {
      let item = {
        'name': result[1],
        'index': result['index']
      };
      items.push(item);
      result = this.REGEX['LIBRARY'].exec(str);
    }
    return items;
  }

  getEntityName(str) {
    var result = this.REGEX['ENTITY'].exec(str);
    if (result == null) {
      return [];
    }
    let item = {
      'name': result[1],
      'description': "",
      'index': result['index']
    };
    return item;
  }
}

module.exports = BaseParser
