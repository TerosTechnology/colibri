"use strict";
const fs = require("fs");
const process = require("process");
const commander = require("commander");
const VHDLFormatter_1 = require("./VHDLFormatter");

function beauty(input,options){
  // const settings = new VHDLFormatter_1.BeautifierSettings(options.removeComments,
  //                           options.removeReports, options.checkAlias,
  //                           options.signAlignSettings, options.keyWordCase,
  //                           options.typeCase, options.indentation, null, options.endOfLine);


  let new_line_after_symbols = new VHDLFormatter_1.NewLineSettings();
  new_line_after_symbols.newLineAfter = ["then", ";"];
  new_line_after_symbols.noNewLineAfter = ["port", "generic"];
  let settings = getDefaultBeautifierSettings(new_line_after_symbols);
  settings.SignAlignSettings = new VHDLFormatter_1.signAlignSettings(true, true, "local", ["PORT", "GENERIC"]);

  // var sett = {
  //   "RemoveComments": false,
  //   "RemoveAsserts": false,
  //   "CheckAlias": false,
  //   "SignAlignSettings": {
  //       "isRegional": true,
  //       "isAll": true,
  //       "mode": "local",
  //       "keyWords": [
  //           "FUNCTION",
  //           "IMPURE FUNCTION",
  //           "GENERIC",
  //           "PORT",
  //           "PROCEDURE"
  //       ]
  //   },
  //   "KeywordCase": "LowerCase",
  //   "TypeNameCase": "LowerCase",
  //   "Indentation": "  ",
  //   "NewLineSettings": {
  //       "newLineAfter": [
  //           ";",
  //           "then"
  //       ],
  //       "noNewLineAfter": []
  //   },
  //   "EndOfLine": "\n"
  // };


  const result = beautify(input, options);
  if (result.err !== null) {
      console.error(`-- [ERROR]: could not beautify`);
  }
  return result.data;
}
function beautify(input, settings) {
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

function getDefaultBeautifierSettings(newLineSettings, signAlignSettings = null, indentation = "  ") {
    return new VHDLFormatter_1.BeautifierSettings(false, false, false, signAlignSettings, "lowercase", "lowercase", indentation, newLineSettings, "\r\n");
}

module.exports = {
  beauty: beauty
}
