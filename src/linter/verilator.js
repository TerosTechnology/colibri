const BaseLinter = require('./linter')

class Verilator extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "verilator --lint-only -bbox-sys --bbox-unsup -DGLBL ",
      'ERROR': /%(Error|Warning)*-*[^:\n]*:{1}[\t ]*([^:\n]+){1}[\t ]*:{1}[\t ]*([0-9]+){1}[\t ]*:{1}[\t ]*(.+)/g,
      'TYPEPOSITION': 1,
      'ROWPOSITION': 3,
      'COLUMNPOSITION': 6,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.ERR,
    }
  }
}

module.exports = {
  Verilator: Verilator
}
