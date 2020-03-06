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
