const BaseLinter = require('./linter')

class Icarus extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "iverilog ",
      'ERROR': /[\t\n ]*(.+){1}[\t]*.v:*([0-9]+):*[\t ]*(error):*[\t ]*([a-zA-Z \t0-9-:_.]+)/g,
      'TYPEPOSITION': 3,
      'ROWPOSITION': 2,
      'COLUMNPOSITION': 5,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = Icarus
