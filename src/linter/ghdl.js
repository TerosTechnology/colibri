const BaseLinter = require('./linter')

class Ghdl extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT' : "ghdl -s -fno-color-diagnostics ",
      'ERROR' : /[\t\n ]*(.+){1}[\t]*.vhd:*([0-9]+):([0-9]+):*[\t ]*(error|warning)*:*[\t ]*(.+)/g,
      'TYPEPOSITION': 4,
      'ROWPOSITION': 2,
      'COLUMNPOSITION': 3,
      'DESCRIPTIONPOSITION': 5,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = Ghdl
