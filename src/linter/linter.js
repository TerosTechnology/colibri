const shell = require('shelljs');

class BaseLinter {
  constructor(path) {
    const pathOS = require('path');
    if (path != null)
      this.path = path + pathOS.sep;
    else
      this.path = "";
    this.OUTPUT = {
      OUT: 0,
      ERR: 1
    };
  }

  lint(file) {
    return this.execute(file);
  }

  execute(file) {
    var cmd = this.path + this.PARAMETERS['SYNT'] + file;
    var str;
    var {
      stdout,
      stderr,
      code
    } = shell.exec(cmd, {
      async: false,
      silent: true
    });

    if (this.PARAMETERS['OUTPUT'] == this.OUTPUT.OUT) {
      str = stdout
    } else if (this.PARAMETERS['OUTPUT'] == this.OUTPUT.ERR) {
      str = stderr
    }

    return this.parseErrors(str, file);
  }


  parseErrors(str, file) {
    let errorRegex = this.PARAMETERS['ERROR']
    let errors = [];
    let result = errorRegex.exec(str);
    while (result !== null) {
      let severity;
      if (result[this.PARAMETERS['TYPEPOSITION']] !== undefined) {
        severity = result[this.PARAMETERS['TYPEPOSITION']];
      } else {
        severity = "error";
      }
      let cl = 0;
      if (result[this.PARAMETERS['COLUMNPOSITION']] == undefined) {
        cl = 0;
      } else {
        cl = parseInt(result[this.PARAMETERS['COLUMNPOSITION']]);
      }
      let error = {
        'severity': severity.toLowerCase(),
        'location': {
          'file': file,
          'position': [parseInt(result[this.PARAMETERS['ROWPOSITION']]), cl]
        },
        'description': result[this.PARAMETERS['DESCRIPTIONPOSITION']]
      };
      errors.push(error);
      result = errorRegex.exec(str);
    }
    return errors;
  }

}

module.exports = BaseLinter
