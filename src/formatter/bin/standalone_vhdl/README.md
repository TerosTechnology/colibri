# VHDL Formatter (CLI Version)

[![Build Status](https://travis-ci.org/raczben/VHDLFormatter.svg?branch=master)](https://travis-ci.org/raczben/VHDLFormatter)

VHDL CLI code formatter written in TypeScript.

[Original online version https://g2384.github.io/VHDLFormatter/](https://g2384.github.io/VHDLFormatter/)

## Usage:

```bash
node vhdlformat.js [OPTIONS] <filename 1> [filename 2] ... [filename N]
```

## Options:

The following command line options are available:

  --key-word-case <casestr>  upper or lower-case the VHDL keywords (default: "uppercase")
  --type-case <casestr>      upper or lower-case the VHDL types (default: "uppercase")
  --indentation <blankstr>   Unit of the indentation. (default: "    ")
  --end-of-line <eol>        Can set the line endings depending your platform. (default: "\r\n")
  --inputFiles <path>        The input files that should be beautified
  --overwrite
  --debug
  --quiet
  --remove-comments
  --remove-reports
  --check-alias
  -v, --version              output the version number
  -h, --help                 output usage information
  
## For contributors

Run test with :

`npm t`  

Build with:

`tsc`

## Release Notes

### 2.5 [2019-03-13]

- keep the front page concise
- add `style.css`, improve UI
- support all browsers (do not use `RegExp Lookbehind Assertions`)

### 2.4 [2019-02-23]

- use local storage to store settings
- add `main.js`
- treat key words and type names separately
- expand/hide setting options
- align signs locally or globally

### 2.3 [2019-02-22]

- bugfix "remove non-comment code by mistake"
- add `tests` folder, improve the project management
- support extended identifier (backslash names)
- fix exponential notation
- user can choose EOL symbols (or use system's by default)
- align comments (when user chooses "align" option)
- bugfix "extra whitespaces around unary minus or plus"

Many thanks to [@MihaiBabiac](https://github.com/MihaiBabiac)

### 2.2 [2018-10-16]

- support enumerated types

### 2.1 [2018-03-22]

- fix keywords case issues
- anything in quotes will not be touched
- correct format for comments after multi-line statement
- options to align signs in parameter lists
- fix function indentation
- fix "align symbols affects process label"
- do not align multi-occurrence symbols in a line
- better styles (checkbox, button, disabled)
- support package bodies
- fix "newline after PORT affects PORT MAP"

### 2.0 [2018-02-16]

- rewrite the main algorithm (& move to a new repository)
- add more unit tests
- fix all known issues

### 1.1 [2016-11]

- fix some bugs reported by users
- add unit tests

### 1.0 [2015-01]

- support most of the VHDL features