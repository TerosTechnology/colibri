// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable no-console */
/* eslint-disable no-console */
const colors = require('colors');
const os = require('os');
const fs = require('fs');
const html_diff = require('html-differ').HtmlDiffer;
const path_lib = require('path');
const Colibri = require('../../src/main');
const Documenter = Colibri.Documenter;
const General = Colibri.General;

var options = {
  ignoreAttributes: [],
  compareAttributesAsJSON: [],
  ignoreWhitespaces: true,
  ignoreComments: true,
  ignoreEndTags: false,
  ignoreDuplicateAttributes: false
};

var html_differ = new html_diff(options);

let file_vhdl = __dirname + path_lib.sep + "resources" + path_lib.sep + "vhdl"
  + path_lib.sep + "test_0.vhd";

let code_vhdl = fs.readFileSync(file_vhdl, { encoding: 'utf8' });
let lang_vhdl = General.LANGUAGES.VHDL;
let comment_symbol_vhdl = "!";

let custom_css = [false, true];
for (let i = 0; i < custom_css.length; ++i) {
  let options = undefined;
  let base_name_resources = __dirname + path_lib.sep + "resources" + path_lib.sep
    + "vhdl" + path_lib.sep + "output" + path_lib.sep;
  let type = "";
  //Use custom css configuration
  if (custom_css[i] === true) {
    let custom_css_vhdl = __dirname + path_lib.sep + "resources" + path_lib.sep + "vhdl"
      + path_lib.sep + "custom.css";
    options = { 'custom_css_path': custom_css_vhdl };
    base_name_resources = __dirname + path_lib.sep + "resources" + path_lib.sep
      + "vhdl" + path_lib.sep + "output_custom_css" + path_lib.sep;
    type = "custom_css_";
  }

  let documenter_vhdl = new Documenter.Documenter(code_vhdl, lang_vhdl, comment_symbol_vhdl);
  //Test HTML
  documenter_vhdl.save_html(__dirname + path_lib.sep + type + "output_test_0_html.html", options).then(function () {
    let filename_expected = base_name_resources + "output_test_0_html.html";
    let expected_file_buffer = fs.readFileSync(filename_expected,'utf-8');
    let file_buffer = fs.readFileSync(__dirname + path_lib.sep + type + "output_test_0_html.html",'utf-8');
    if (html_differ.isEqual(expected_file_buffer, file_buffer) !== true) { 
      fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_html.html");
      throw new Error(`Error ${type}HTML.`.red);
    }
    console.log(`Test  ${type}HTML -> OK!`.green);
    fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_html.html");
  });
  //Test Markdown
  documenter_vhdl.save_markdown(__dirname + path_lib.sep + type + "output_test_0_md.md").then(function () {
    let filename_expected = base_name_resources + "output_test_0_md.md";
    let expected_file_buffer = fs.readFileSync(filename_expected,'utf-8');
    let file_buffer = fs.readFileSync(__dirname + path_lib.sep + type + "output_test_0_md.md",'utf-8');
    if ((file_buffer===expected_file_buffer) !== true) {
      fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_md.md");
      throw new Error(`Error  ${type}Markdown.`.red);
    }
    console.log(`Test  ${type}Markdown -> OK!`.green);
    fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_md.md");
  });
  //Test PDF
  if (os.platform !== "win32") {
    documenter_vhdl.save_pdf(__dirname + path_lib.sep + type + "output_test_0_pdf.pdf", options).then(function () {
      let filename_expected = base_name_resources + "output_test_0_pdf.svg";
      let expected_file_buffer = fs.readFileSync(filename_expected);
      let file_buffer = fs.readFileSync(__dirname + path_lib.sep + type + "output_test_0_md.svg");
      if (file_buffer.equals(expected_file_buffer) !== true) {
        fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_md.svg");
        throw new Error(`Error  ${type}pdf.`.red);
      }
      console.log(`Test  ${type}pdf -> OK!`.green);
      fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_md.svg");
    });
  }
  //Test SVG
    documenter_vhdl.save_svg(__dirname + path_lib.sep + type + "output_test_0_svg.svg").then(function() {
      let filename_expected = base_name_resources + "output_test_0_svg.svg";
      let expected_file_buffer = fs.readFileSync(filename_expected);
      let file_buffer = fs.readFileSync(__dirname + path_lib.sep + type + "output_test_0_svg.svg");
      if (file_buffer.equals(expected_file_buffer) !== true){
        fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_svg.svg");
        throw new Error(`Error  ${type}svg.`.red);
      }
      console.log(`Test  ${type}svg -> OK!`.green);
      fs.unlinkSync(__dirname + path_lib.sep + type + "output_test_0_svg.svg");
    });

}
