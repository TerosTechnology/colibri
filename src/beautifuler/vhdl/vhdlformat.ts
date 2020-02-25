import * as fs from 'fs';
import * as process from 'process'
import * as commander from 'commander'
import { beautify as _beautify, BeautifierSettings } from "./VHDLFormatter";

interface BeautifyStatus {
  err?: object;
  data: string;
};

function beautify(input: string, settings: BeautifierSettings): BeautifyStatus {
  try {
    const data = _beautify(input, settings);
    return {
      data,
      err: null,
    };
  } catch (err) {
    return {
      data: null,
      err,
    };
  }
}

function main(options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(options.inputFile)) {
      console.error(`-- [ERROR]: could not read filename "${options.inputFile}"`);
      reject(new Error("Could not find file"));
      return;
    }

    fs.readFile(options.inputFile, (err, data) => {
      if (err != null || ((typeof data) === "undefined")) {
        console.error(`-- [ERROR]: could not read filename "${options.inputFile}"`);
        reject(err);
      }
      const input_vhdl = data.toString('utf8');

      const settings = new BeautifierSettings(
        options.removeComments,
        options.removeReports,
        options.checkAlias,
        options.signAlignSettings,
        options.keyWordCase,
        options.typeCase,
        options.indentation,
        null,
        options.endOfLine,
      );

      const result = beautify(input_vhdl, settings);

      if (result.err !== null) {
        console.error(`-- [ERROR]: could not beautify "${options.input}"`);
        reject(err);
      }

      const output_vhdl = result.data;

      if (!options.quiet) {
        console.log(output_vhdl);
      }

      if (options.overwrite) {
        const data = new Uint8Array(Buffer.from(output_vhdl));
        fs.writeFile(options.input, data, (err) => {
          if (err) {
            console.error(`-- [ERROR]: could not save "${options.input}"`);
            reject(err);
          } else {

            console.log(`-- [INFO]: saved file "${options.input}"`);
            resolve();
          }
        });
      }
      else {
        console.error(`-- [INFO]: read file "${options.input}"`);
        resolve();
      }
    });
  });
}

(() => {
    
    
  let myCommander = commander
    .description('vhdlformat beautifies your vhdl sources. It can indentat lines and change cases of the string literals.')
    .option('--key-word-case <casestr>',    'upper or lower-case the VHDL keywords', 'uppercase')
    .option('--type-case <casestr>',        'upper or lower-case the VHDL types', 'uppercase')
    .option('--indentation <blankstr>',     'Unit of the indentation.', '    ')
    .option('--end-of-line <eol>',          'Can set the line endings depending your platform.', '\r\n')
    .option('--inputFiles <path>',          'The input files that should be beautified')
    .option('--overwrite',                  '', '')
    .option('--debug',                      '', '')
    .option('--quiet',                      '', '')
    .option('--remove-comments',            '', '')
    .option('--remove-reports',             '', '')
    .option('--check-alias',                '', '')
    .version('0.0.1', '-v, --version');
    

  let args =  myCommander.parse(process.argv);
  args.inputFiles = args.args;
  

  if (args.inputFiles.length < 1) {
    console.error("-- [ERROR]: must specify at least one input filename")
    myCommander.help();
    return;
  }

  args.inputFiles.forEach((input) => {
    args.inputFile = input
    main(args).catch((err) => {
      if (args.verbose) {
        console.error(err);
      }
    });
  })

})();
