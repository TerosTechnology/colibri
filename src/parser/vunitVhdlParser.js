const shell = require('child_process');
const path  = require('path');

class VhdlParser {
  getAll(str) {
    var path_python = __dirname + path.sep + "parser.py"
    var cmd = "python3 " + path_python + ' "' + str + ' "';
    const execSync = require('child_process').execSync;
    var stdout = execSync(cmd).toString();
    stdout = stdout.replace(/'/g,'"');
    stdout = stdout.replace(/\//g,'\\/');
    var structure = JSON.parse(stdout);
    return structure;
  }
}

module.exports =  VhdlParser
