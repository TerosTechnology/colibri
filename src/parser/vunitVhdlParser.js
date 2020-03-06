const shell = require('child_process');
const path  = require('path');

class VhdlParser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol
  }

  getAll(str) {
    var path_python = __dirname + path.sep + "parser.py"
    str = str.replace(/"/g,'\\"');
    var cmd = "python3 " + path_python + ' "' + this.comment_symbol + '" ' + ' "' + str + ' "';
    const execSync = require('child_process').execSync;
    var stdout = execSync(cmd).toString();
    var structure = JSON.parse(stdout);
    return structure;
  }
}

module.exports =  VhdlParser
