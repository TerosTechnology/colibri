const BaseLinter = require('./linter')

class Modelsim extends BaseLinter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "vcom -2008 ",
      'ERROR': /\** *(Error|Warning)*[ ()a-zA-Z]*: *([/\t:=$&%#@?¿'¡! A-Za-z._0-9]+)*[(]{1}[\t]*([0-9]+)*[)]{1}[\t]*:*[\t ]*(.+)/ig,
      'TYPEPOSITION': 1,
      'ROWPOSITION': 3,
      'COLUMNPOSITION': 6,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.OUT,
    }
  }
}

module.exports = Modelsim
