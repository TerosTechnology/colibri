"use strict";
const fs = require("fs");
const process = require("process");
const commander = require("commander");
const VHDLFormatter_1 = require("./VHDLFormatter");

class Beautifuler {
  beauty(input,options){
    let new_line_after_symbols = new VHDLFormatter_1.NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = this.getDefaultBeautifierSettings(new_line_after_symbols);
    settings.SignAlignSettings = new VHDLFormatter_1.signAlignSettings(true, true, "local", ["PORT", "GENERIC"]);

    const result = this.beautifyIntern(input, options);
    if (result.err !== null) {
      console.error(`-- [ERROR]: could not beautify`);
    }
    return result.data;
  }
  beautifyIntern(input, settings) {
    try {
      const data = VHDLFormatter_1.beautify(input, settings);
      return {
        data,
        err: null,
      };
    }
    catch (err) {
      return {
        data: null,
        err,
      };
    }
  }

  getDefaultBeautifierSettings(newLineSettings, signAlignSettings = null, indentation = "  ") {
    return new VHDLFormatter_1.BeautifierSettings(false, false, false, signAlignSettings, "lowercase", "lowercase", indentation, newLineSettings, "\r\n");
  }
}

module.exports = {
  Beautifuler: Beautifuler
}
