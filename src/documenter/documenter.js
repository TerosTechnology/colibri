// Copyright 2021 Teros Technology
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

const fs = require('fs');
const path_lib = require('path');
const Diagram = require('./diagram');
const Stm = require('../parser/stm_parser');
const ParserLib = require('../parser/factory');
const showdown = require('showdown');
const json5 = require('json5');
const temp = require('temp');

class Documenter {
  constructor(code, lang, comment_symbol, config) {
    this.lang = lang;
    this.code = code;
    this.comment_symbol = comment_symbol;
    this.set_config(config);
  }

  set_config(config) {
    if (config === undefined) {
      this.config = {
        'fsm': true,
        'signals': 'all',
        'constants': 'all',
        'process': 'all'
      };
    }
    else {
      this.config = config;
    }
  }

  set_symbol(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }

  set_code(code) {
    this.code = code;
  }

  set_lang(lang) {
    this.lang = lang;
  }

  set_comment_symbol(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }

  // ***************************************************************************
  // options = {"custom_css_path":"/custom_css/path"}
  async save_html(path, options) {
    if (options === undefined) {
      options = { 'html_style': 'save' };
    }
    else {
      options.html_style = 'save';
    }
    let html_value = await this.get_html(options);
    let html_doc = html_value.html;
    fs.writeFileSync(path, html_doc);
  }
  // options = {"custom_css_path":"/custom_css/path"}
  async save_pdf(path, options) {
    await this._get_pdf(path, options);
  }
  async save_svg(path) {
    let svg_diagram_str = await this._get_diagram_svg();
    await fs.writeFileSync(path, svg_diagram_str);
    await this._save_fsms(path);
    await this._save_wavedrom(path);
  }
  async save_markdown(path, config) {
    let custom_section = undefined;
    let custom_svg_path = path;

    let file = path_lib.dirname(custom_svg_path) + path_lib.sep + 
          path_lib.basename(custom_svg_path, path_lib.extname(custom_svg_path)) + ".svg";

    if (config !== undefined){
      if (config.custom_section !== undefined){
        custom_section = config.custom_section;
      }
      if (config.custom_svg_path !== undefined){
        custom_svg_path = config.custom_svg_path;
        file = custom_svg_path + path_lib.sep + 
            path_lib.basename(path, path_lib.extname(path)) + ".svg";
      }
    }
    let md = await this._get_markdown(file, null, custom_section);
    fs.writeFileSync(path, md);
  }
  // ***************************************************************************
  async get_html(options) {
    let html_doc = await this._get_html_from_code(options);
    return html_doc;
  }

  async _get_markdown(path, extra_top_space, custom_section) {
    let extra_top_space_l = "";
    if (extra_top_space !== null && extra_top_space !== false) {
      extra_top_space_l = "&nbsp;&nbsp;\n\n";
    }
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined) {
      return "";
    }
    let markdown_doc = extra_top_space_l;

    //Entity
    if (code_tree['entity'] !== undefined) {
      //Title
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        markdown_doc += "# " + code_tree['info']['title'] + "\n";
      }else{
        markdown_doc += "# Entity: " + code_tree['entity']['name'] + "\n";
      }
      //Optional info section
      markdown_doc += this._get_info_section(code_tree);
      //Diagram
      await this._save_svg_from_code_tree(path, code_tree);
      markdown_doc += "## Diagram\n";
      markdown_doc += '![Diagram](' + path_lib.basename(path) + ' "Diagram")';
      markdown_doc += "\n";
      //Description
      markdown_doc += "## Description\n";

      const { description, wavedrom } = this._get_wavedrom_svg(code_tree['entity']['description']);
      let wavedrom_description = description;
      for (let i = 0; i < wavedrom.length; ++i) {
        let random_id = this._makeid(4);
        let img = `![alt text](wavedrom_${random_id}${i}.svg "title")`;
        let path_img = path_lib.dirname(path) + path_lib.sep + `wavedrom_${random_id}${i}.svg`;
        fs.writeFileSync(path_img, wavedrom[i]);
        wavedrom_description = wavedrom_description.replace("$cholosimeone$" + i, img);
      }
      markdown_doc += wavedrom_description;
      //Custom section
      if (custom_section !== undefined){
        markdown_doc += `\n${custom_section}\n`;
      }
      //Generics and ports
      markdown_doc += this._get_in_out_section(code_tree['ports'], code_tree['generics'],code_tree['virtual_buses']);
    }
    //Package
    if (code_tree.package !== undefined) {
      //Title
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        markdown_doc += "# " + code_tree['info']['title'] + "\n";
      }else{
        markdown_doc += "# Package: " + code_tree['package']['name'] + "\n";
      }
      //Optional info section
      markdown_doc += this._get_info_section(code_tree);
      //Description
      markdown_doc += "## Description\n";
      markdown_doc += code_tree['package']['description'] + "\n";

      //Custom section
      if (custom_section !== undefined){
        markdown_doc += `\n${custom_section}\n`;
      }
    }

    //Signals, constants and types
    if (code_tree['declarations'] !== undefined) {
      markdown_doc += this._get_signals_constants_section(
        code_tree['declarations']['signals'], code_tree['declarations']['constants'],
        code_tree['declarations']['types']);
      //Functions
      markdown_doc += this._get_functions_section(code_tree['declarations']['functions']);
    }
    if (code_tree['body'] !== undefined) {
      //Processes
      markdown_doc += this._get_process_section(code_tree['body']['processes']);
      //Instantiations
      markdown_doc += this._get_instantiations_section(code_tree['body']['instantiations']);
    }

    // State machine diagrams
    let stm_array = await this._get_stm();
    if (this.config.fsm === true && stm_array !== undefined && stm_array.length !== 0) {
      markdown_doc += "## State machines\n";
      for (let i = 0; i < stm_array.length; ++i) {
        let entity_name = code_tree['entity']['name'];
        let stm_path = `${path_lib.dirname(path)}${path_lib.sep}stm_${entity_name}_${i}${i}.svg`;
        if (stm_array[i].description !== '') {
          markdown_doc += '- ' + stm_array[i].description;
        }
        fs.writeFileSync(stm_path, stm_array[i].svg);
        markdown_doc += `![Diagram_state_machine_${i}]( stm_${entity_name}_${i}${i}.svg "Diagram")`;
      }
    }

    return markdown_doc;
  }

  _makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async _get_markdown_for_pdf() {
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined) {
      return "";
    }
    let markdown_doc = "";
    //Entity
    if (code_tree['entity'] !== undefined) {
      //Title
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        markdown_doc += "# " + code_tree['info']['title'] + "\n";
      }else{
        markdown_doc += "# Entity: " + code_tree['entity']['name'] + "\n";
      }
      //Optional info section
      markdown_doc += this._get_info_section(code_tree);
      //Diagram
      markdown_doc += "## Diagram\n";
      let path_diagram = temp.openSync().path;

      await this._save_svg_from_code_tree(path_diagram + ".svg", code_tree);
      markdown_doc += '![Diagram](' + path_diagram + '.svg "Diagram")';
      markdown_doc += "\n";
      //Description
      markdown_doc += "## Description\n";

      const { description, wavedrom } = this._get_wavedrom_svg(code_tree['entity']['description']);
      let wavedrom_description = description;
      for (let i = 0; i < wavedrom.length; ++i) {
        let path_img = path_lib.dirname(path_diagram) + path_lib.sep + `wavedrom_${i}.svg`;
        fs.writeFileSync(path_img, wavedrom[i]);
        let img = `![alt text](${path_img} "title")`;
        wavedrom_description = wavedrom_description.replace("$cholosimeone$" + i, img);
      }
      markdown_doc += wavedrom_description;

      //Generics and ports
      markdown_doc += this._get_in_out_section(code_tree['ports'], code_tree['generics'],code_tree['virtual_buses']);
    }
    //Package
    if (code_tree.package !== undefined) {
      //Title
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        markdown_doc += "# " + code_tree['info']['title'] + "\n";
      }else{
        markdown_doc += "# Package: " + code_tree['package']['name'] + "\n";
      }
      //Optional info section
      markdown_doc += this._get_info_section(code_tree);
      //Description
      markdown_doc += "## Description\n";
      markdown_doc += code_tree['package']['description'] + "\n";
    }
    if (code_tree['declarations'] !== undefined) {
      //Signals and constants
      markdown_doc += this._get_signals_constants_section(
        code_tree['declarations']['signals'], code_tree['declarations']['constants'],
        code_tree['declarations']['types']);
      //Functions
      markdown_doc += this._get_functions_section(code_tree['declarations']['functions']);
    }
    if (code_tree['body'] !== undefined) {
      //Processes
      markdown_doc += this._get_process_section(code_tree['body']['processes']);
      //Instantiations
      markdown_doc += this._get_instantiations_section(code_tree['body']['instantiations']);
    }

    // State machine diagrams
    let stm_array = await this._get_stm();
    if (this.config.fsm === true && stm_array !== undefined && stm_array.length !== 0) {
      markdown_doc += "## State machines\n";
      for (let i = 0; i < stm_array.length; ++i) {
        let path_diagram_tmp = temp.openSync().path + '.svg';
        if (stm_array[i].description !== '') {
          markdown_doc += '\n- ' + stm_array[i].description;
        }
        fs.writeFileSync(path_diagram_tmp, stm_array[i].svg);
        markdown_doc += `![Diagram_state_machine_${i}]( ${path_diagram_tmp} "Diagram")`;
      }
    }

    return markdown_doc;
  }

  async _get_html_from_code(options) {
    let html_style = "";
    let html_style_preview = `
<style>
  #teroshdl h1,#teroshdl h2,#teroshdl h3,#teroshdl table, #teroshdl svg {margin-left:2.5%;}
  svg {width:100%;height:100%;}
  #state_machine {width:70%;height:70%;display: block;margin: auto;}
  code {color:#545253;}
  #teroshdl {color:black;}
  div.templateTerosHDL { background-color: white;position:absolute; }
  #teroshdl td,#teroshdl th,#teroshdl h1,#teroshdl h2,#teroshdl h3 {color: black;}
  #teroshdl h1,#teroshdl h2 {font-weight:bold;}
  #teroshdl tr:hover {background-color: #ddd;}
  #teroshdl td, #teroshdl th {
    border: 1px solid grey
  }
  #teroshdl p {color:black;}
  #teroshdl p {margin-left:2.5%;}
  #teroshdl th { background-color: #ffd78c;}
  #teroshdl tr:nth-child(even){background-color: #f2f2f2;}
</style>
<div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%">\n`;

    let html_style_save = `
  <style>
    #teroshdl h1,#teroshdl h2,#teroshdl h3,#teroshdl table, #teroshdl svg {margin-left:2.5%;width:60%}
    code {color:#545253;}
    #teroshdl {color:black;}
    div.templateTerosHDL { background-color: white;position:absolute; }
    #teroshdl td,#teroshdl th,#teroshdl h1,#teroshdl h2,#teroshdl h3 {color: black;}
    #teroshdl h1,#teroshdl h2 {font-weight:bold}
    #teroshdl tr:hover {background-color: #ddd;}
    #teroshdl td, #teroshdl th {
      border: 1px solid grey;
    }
    #teroshdl p {color:black;}
    #teroshdl p {margin-left:2.5%;}
    #teroshdl th { background-color: #ffd78c;}
    #teroshdl tr:nth-child(even){background-color: #f2f2f2;}
  </style>
  <div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%">\n`;

    if (options !== undefined && options.html_style !== undefined
      && options.html_style === "save") {
      html_style = html_style_save;
    }
    else {
      html_style = html_style_preview;
    }

    //HTML style
    let html = "";
    if (options !== undefined && options.custom_css_path !== undefined) {
      try {
        let custom_css_str = fs.readFileSync(options.custom_css_path, { encoding: 'utf8' });
        html = `<style>\n${custom_css_str}</style>\n`;
        html += `<div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%">\n`;
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        html = html_style;
      }
    }
    else {
      html = html_style;
    }
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined) {
      return { 'html': html, error: true };
    }

    let converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
    converter.setFlavor('github');

    html += converter.makeHtml("&nbsp;&nbsp;\n\n");
    //Entity
    if (code_tree['entity'] !== undefined) {
      //Title
      let doc_title;
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        doc_title = "# " + code_tree['info']['title'] + "\n";
      }else{
        doc_title = "# Entity: " + code_tree['entity']['name'] + "\n";
      }
      html += converter.makeHtml(doc_title);
      html += converter.makeHtml(this._get_info_section(code_tree));
      //Diagram
      html += converter.makeHtml("## Diagram\n");
      html += converter.makeHtml((await this._get_diagram_svg_from_code_tree(code_tree) + "\n").replace(/\*/g, "\\*").replace(/\`/g, "\\`"));
      //Description
      html += converter.makeHtml("## Description\n");
      const { description, wavedrom } = this._get_wavedrom_svg(code_tree['entity']['description']);

      let html_description = converter.makeHtml(description);

      for (let i = 0; i < wavedrom.length; ++i) {
        html_description = html_description.replace("$cholosimeone$" + i, wavedrom[i]);
      }
      html += html_description;
      //Generics and ports
      html += converter.makeHtml(this._get_in_out_section(code_tree['ports'], code_tree['generics'],code_tree['virtual_buses']));
    }
    //Package
    if (code_tree.package !== undefined) {
      //Title
      let doc_title;
      if (code_tree['info'] !== undefined && code_tree['info']['title'] !== undefined){
        doc_title = "# " + code_tree['info']['title'] + "\n";
      }else{
        doc_title = "# Package: " + code_tree['package']['name'] + "\n";
      }
      html += converter.makeHtml(doc_title);
      html += converter.makeHtml(this._get_info_section(code_tree));
      html += converter.makeHtml("## Description\n");
      html += converter.makeHtml(code_tree['package']['description'] + "\n");
    }
    if (code_tree['declarations'] !== undefined) {
      //Signals and constants
      html += converter.makeHtml(this._get_signals_constants_section(
        code_tree['declarations']['signals'], code_tree['declarations']['constants'],
        code_tree['declarations']['types']));
      //Functions
      html += converter.makeHtml(this._get_functions_section(code_tree['declarations']['functions']));
    }
    if (code_tree['body'] !== undefined) {
      //Processes
      html += converter.makeHtml(this._get_process_section(code_tree['body']['processes']));
      //Instantiations
      html += converter.makeHtml(this._get_instantiations_section(code_tree['body']['instantiations']));
    }

    // State machine diagrams
    let stm_array = await this._get_stm();
    if (this.config.fsm === true && stm_array !== undefined && stm_array.length !== 0) {
      html += converter.makeHtml("## State machines\n");
      html += '<div>';
      for (let i = 0; i < stm_array.length; ++i) {
        if (stm_array[i].description !== '') {
          html += converter.makeHtml('- ' + stm_array[i].description);
        }
        html += `<div id="state_machine">${stm_array[i].svg}</div>`;
      }
      html += '</div>';
    }
    html += '<br><br><br><br><br><br>';

    return { 'html': html, error: false };
  }

  async _get_pdf(path, options) {
    let markdownpdf = require("markdown-pdf");
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined) {
      return;
    }

    let markdown_doc = await this._get_markdown_for_pdf();

    let options_md_pdf = {
      cssPath: __dirname + path_lib.sep + 'custom.css'
    };
    if (options !== undefined && options.custom_css_path !== undefined) {
      options_md_pdf.cssPath = options.custom_css_path;
    }

    await markdownpdf(options_md_pdf).from.string(markdown_doc).to(path);
  }

  _get_wavedrom_svg(text) {
    //Search json candidates
    let json_candidates = this._get_json_candidates(text);
    let svg_diagrams = [];
    let text_modified = text;

    let wavedrom = require('wavedrom');
    var render = require('bit-field/lib/render');
    let onml = require('onml');

    let counter = 0;
    for (let i = 0; i < json_candidates.length; ++i) {
      try {
        let json = json5.parse(json_candidates[i]);
        let diagram = wavedrom.renderAny(0, json, wavedrom.waveSkin);
        let diagram_svg = onml.s(diagram);
        svg_diagrams.push(diagram_svg);
        text_modified = text_modified.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
        ++counter;
      }
      catch (error) {
        try {
          let json = json5.parse(json_candidates[i]);
          let options = {
            hspace: 888
          };
          let jsonml = render(json, options);
          let diagram_svg = onml.stringify(jsonml);

          svg_diagrams.push(diagram_svg);
          text_modified = text_modified.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
          ++counter;
        }
        // eslint-disable-next-line no-console
        catch (error) { console.log(""); }
      }

    }
    return { description: text_modified, wavedrom: svg_diagrams };
  }

  _get_json_candidates(text) {
    let json = [];
    let i = 0;
    let brackets = 0;
    let character_number_begin = 0;
    while (i < text.length) {
      if (text[i] === '{') {
        character_number_begin = i;
        ++brackets;
        ++i;
        while (i < text.length) {
          if (text[i] === '{') {
            ++brackets;
            ++i;
          }
          else if (text[i] === '}') {
            --brackets;
            if (brackets === 0) {
              json.push(text.slice(character_number_begin, i + 1));
              break;
            }
            ++i;
          }
          else {
            ++i;
          }
        }
      }
      else {
        ++i;
      }
    }
    return json;
  }

  async _get_diagram_svg() {
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined) {
      return;
    }
    return await Diagram.diagramGenerator(code_tree, 0);
  }

  async _get_diagram_svg_from_code_tree(code_tree) {
    let svg_diagram_str = await Diagram.diagramGenerator(code_tree, 0);
    return svg_diagram_str;
  }

  async _save_svg_from_code_tree(path, code_tree) {
    let svg_diagram_str = await this._get_diagram_svg_from_code_tree(code_tree);
    fs.writeFileSync(path, svg_diagram_str);
  }

  async _save_fsms(path) {
    let markdown_doc = '';
    let code_tree = await this._get_code_tree(this.code);
    if (code_tree === undefined) {
      return;
    }
    let stm_array = await this._get_stm();
    for (let i = 0; i < stm_array.length; ++i) {
      let entity_name = code_tree['entity']['name'];
      let stm_path = `${path_lib.dirname(path)}${path_lib.sep}stm_${entity_name}_${i}${i}.svg`;
      if (stm_array[i].description !== '') {
        markdown_doc += '- ' + stm_array[i].description;
      }
      fs.writeFileSync(stm_path, stm_array[i].svg);
    }
  }

  async _save_wavedrom(path) {
    let code_tree = await this._get_code_tree(this.code);
    if (code_tree === undefined) {
      return;
    }
    const { description, wavedrom } = this._get_wavedrom_svg(code_tree['entity']['description']);
    let wavedrom_description = description;
    for (let i = 0; i < wavedrom.length; ++i) {
      let random_id = this._makeid(4);
      let img = `![alt text](wavedrom_${random_id}${i}.svg "title")`;
      let path_img = path_lib.dirname(path) + path_lib.sep + `wavedrom_${random_id}${i}.svg`;
      fs.writeFileSync(path_img, wavedrom[i]);
      wavedrom_description = wavedrom_description.replace("$cholosimeone$" + i, img);
    }
  }

  async _get_code_tree() {
    let parser = await this.get_parser(this.lang);
    let code_tree = await parser.get_all(this.code, this.symbol);
    return code_tree;
  }

  async init() {
    await this.create_parser('vhdl');
    await this.create_parser('verilog');
  }

  async get_parser(lang) {
    if (this.vhdl_parser === undefined || this.verilog_parser === undefined) {
      await this.init();
    }

    if (lang === 'vhdl') {
      return this.vhdl_parser;
    }
    else if (lang === 'verilog') {
      return this.verilog_parser;
    }
    else {
      return undefined;
    }
  }

  async create_parser(lang) {
    let parser = new ParserLib.ParserFactory;
    if (lang === 'vhdl') {
      //VHDL parser
      this.vhdl_parser = await parser.getParser(this.lang, this.comment_symbol);
    }
    else if (lang === 'verilog') {
      //Verilog parser
      this.verilog_parser = await parser.getParser(this.lang, this.comment_symbol);
    }
  }

  async _get_stm() {
    let stm_array = await Stm.get_svg_sm(this.lang, this.code, this.comment_symbol);
    return stm_array.svg;
  }

  async _gen_code_tree() {
    this.code_tree = await this._get_code_tree();
  }

  _get_info_section(code_tree){
    let markdown_doc = "";
    //Doxygen parsed commands insertion (only if available)
    if (code_tree['info'] !== undefined){
      if (code_tree['info']['file'] !== undefined){
        markdown_doc += "- **File:** " + code_tree['info']['file'] + "\n";
      }
      if (code_tree['info']['author'] !== undefined){
        markdown_doc += "- **Author:** " + code_tree['info']['author'] + "\n";
      }
      if (code_tree['info']['version'] !== undefined){
        markdown_doc += "- **Version:** " + code_tree['info']['version'] + "\n";
      }
      if (code_tree['info']['date'] !== undefined){
        markdown_doc += "- **Date:** " + code_tree['info']['date'] + "\n";
      }
      if (code_tree['info']['copyright'] !== undefined){
        markdown_doc += "- **Copyright:** " + code_tree['info']['copyright'] + "\n";
      }
    }
    return markdown_doc;
  }
  _get_in_out_section(ports, generics,virtual_buses) {
    let md = "";
    //Title
    md += "## Generics and ports\n";
    //Tables
    md += "### Table 1.1 Generics\n";
    if (generics.length !== 0) {
      md += this._get_doc_generics(generics);
    }
    md += "### Table 1.2 Ports\n";
    if (ports.length !== 0) {
      if (virtual_buses !== undefined) {
        let virtual_buses_to_add = virtual_buses.filter(obj => obj.keep_ports === true);
        if (virtual_buses_to_add.length > 0) {
          for (let i = 0; i < virtual_buses_to_add.length; i++) {
            const element = virtual_buses_to_add[i];
            ports = ports.filter(function(value, index, arr){ 
              return value.name !== element.name;
          });
          ports = ports.concat(element.ports)
          }
        }
      }
      md += this._get_doc_ports(ports);
    }
    if (virtual_buses !== undefined) {
      let virtual_buses_to_show = virtual_buses.filter(obj => obj.keep_ports === false);
      if (virtual_buses_to_show.length > 0) {
        md += "### 1.3 Virtual Buses\n";
        for (let i = 0; i < virtual_buses_to_show.length; i++) {
          const element = virtual_buses_to_show[i];
          md += "### Table 1.3."+(i+1).toString()+" "+ element.name+"\n";
          md += this._get_doc_ports(element.ports);
        }
      }
    }
    return md;
  }

  _get_elements_with_description(elements) {
    let elements_i = [];
    for (let i = 0; i < elements.length; ++i) {
      let description = elements[i].description.replace(/ /g, '').replace(/\n/g, '');
      if (description !== '') {
        elements_i.push(elements[i]);
      }
    }
    return elements_i;
  }

  _get_signals_constants_section(signals, constants, types) {
    let md = "";

    if (this.config.signals === 'commented') {
      signals = this._get_elements_with_description(signals);
    }
    if (this.config.constants === 'commented') {
      constants = this._get_elements_with_description(constants);
      types = this._get_elements_with_description(types);
    }

    if ((signals.length !== 0 && this.config.signals !== 'none') ||
      (constants.length !== 0 && this.config.constants !== 'none') || types.length !== 0) {
      //Title
      md += "## Signals, constants and types\n";
      //Tables
      if (signals.length !== 0 && this.config.signals !== 'none') {
        md += "### Signals\n";
        md += this._get_doc_signals(signals);
      }
      if (constants.length !== 0 && this.config.constants !== 'none') {
        md += "### Constants\n";
        md += this._get_doc_constants(constants);
      }
      if (types.length !== 0 && this.config.constants !== 'none') {
        md += "### Types\n";
        md += this._get_doc_types(types);
      }
    }
    return md;
  }

  _get_process_section(process) {
    if (this.config.process === 'none') {
      return '';
    }
    if (this.config.process === 'commented') {
      process = this._get_elements_with_description(process);
    }
    let md = "";
    if (process.length !== 0) {
      //Title
      md += "## Processes\n";
      for (let i = 0; i < process.length; ++i) {
        md += `- **${process[i].name}**: ***( ${process[i].sens_list} )***\n`;
        md += `${process[i].description}\n`;
      }
    }
    return md;
  }

  _get_functions_section(functions) {
    let md = "";
    if (this.config.process === 'none') {
      return '';
    }
    if (functions.length !== 0) {
      //Title
      md += "## Functions\n";
      for (let i = 0; i < functions.length; ++i) {
        md += `- **${functions[i].name}**\n`;
        md += `${functions[i].description}\n`;
      }
    }
    return md;
  }

  _get_instantiations_section(instantiations) {
    let md = "";
    if (instantiations.length !== 0) {
      //Title
      md += "## Instantiations\n";
      for (let i = 0; i < instantiations.length; ++i) {
        md += `- **${instantiations[i].name}**: ${instantiations[i].type}\n`;
        md += `${instantiations[i].description}\n`;
      }
    }
    return md;
  }

  _get_doc_ports(ports) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Port name", "Direction", "Type", "Description"]);
    for (let i = 0; i < ports.length; ++i) {
      let direction = ports[i]['direction'].replace(/\r/g, ' ').replace(/\n/g, ' ')
      if (ports[i]['type'] === "virtual_bus"){
        direction = "-";
      }
      table.push([ports[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      direction,
      ports[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      ports[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_generics(generics) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Generic name", "Type", "Value", "Description"]);
    for (let i = 0; i < generics.length; ++i) {
      table.push([generics[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['default_value'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_signals(signals) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Description"]);
    for (let i = 0; i < signals.length; ++i) {
      table.push([signals[i]['name'],
      signals[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      signals[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_constants(constants) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Value", "Description"]);
    for (let i = 0; i < constants.length; ++i) {
      table.push([constants[i]['name'],
      constants[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      constants[i]['default_value'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      constants[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_types(tpyes) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Name", "Type", "Description"]);
    for (let i = 0; i < tpyes.length; ++i) {
      table.push([tpyes[i]['name'],
      tpyes[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      tpyes[i]['description'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

}

async function get_md_doc_from_array(files, output_dir_doc, symbol_vhdl, symbol_verilog,
  graph, project_name, with_dependency_graph, config) {
  //Main doc
  let main_doc = "# Project documentation: " + project_name + "\n";
  let lang = "vhdl";
  let symbol = "!";
  for (let i = 0; i < files.length; ++i) {
    let filename = path_lib.basename(files[i], path_lib.extname(files[i]));
    if (path_lib.extname(files[i]) === '.vhd' || path_lib.extname(files[i]) === '.vho'
      || path_lib.extname(files[i]) === '.vhdl') {
      lang = "vhdl";
      symbol = symbol_vhdl;
    }
    else if (path_lib.extname(files[i]) === '.v' || path_lib.extname(files[i]) === '.vh'
      || path_lib.extname(files[i]) === '.vl' || path_lib.extname(files[i]) === '.sv'
      || path_lib.extname(files[i]) === '.SV') {
      lang = "verilog";
      symbol = symbol_verilog;
    }
    else { break; }
    main_doc += "- [" + filename + "](./" + filename + ".md)\n";

    let contents = fs.readFileSync(files[i], 'utf8');

    let doc_inst = new Documenter(contents, lang, symbol, config);
    doc_inst.save_markdown(output_dir_doc + path_lib.sep + filename + ".md");
  }
  if (with_dependency_graph === true) {
    main_doc += "# Project dependency graph\n";
    main_doc += '![system](./dependency_graph.svg "System")';
    fs.writeFileSync(output_dir_doc + path_lib.sep + "dependency_graph.svg", graph);
  }
  fs.writeFileSync(output_dir_doc + path_lib.sep + "README.md", main_doc);
}

async function get_html_doc_from_array(files, output_dir_doc, symbol_vhdl, symbol_verilog,
  graph, project_name, with_dependency_graph, config) {
  //Main doc
  let main_doc = "<h1>Project documentation</h1>\n";
  if (with_dependency_graph === true) {
    main_doc += "<h2>Project dependency graph\n</h2>";
    main_doc += graph + '\n';
    main_doc += "<h2>Files\n</h2>";
  }
  let lang = "vhdl";
  let symbol = "!";

  main_doc += '<ul>';
  for (let i = 0; i < files.length; ++i) {
    let filename = path_lib.basename(files[i], path_lib.extname(files[i]));
    if (path_lib.extname(files[i]) === '.vhd' || path_lib.extname(files[i]) === '.vho'
      || path_lib.extname(files[i]) === '.vhdl') {
      lang = "vhdl";
      symbol = symbol_vhdl;
    }
    else if (path_lib.extname(files[i]) === '.v' || path_lib.extname(files[i]) === '.vh'
      || path_lib.extname(files[i]) === '.vl' || path_lib.extname(files[i]) === '.sv'
      || path_lib.extname(files[i]) === '.SV') {
      lang = "verilog";
      symbol = symbol_verilog;
    }
    else { break; }
    // main_doc += "- [" + filename + "](./" + filename + ".md)\n";
    main_doc += `  <li><a href="${filename}.html">${filename}</a>\n</li>`;

    let contents = fs.readFileSync(files[i], 'utf8');

    let doc_inst = new Documenter(contents, lang, symbol, config);
    doc_inst.save_html(output_dir_doc + path_lib.sep + filename + ".html");
  }
  main_doc += '</ul>';
  fs.writeFileSync(output_dir_doc + path_lib.sep + "index.html", main_doc);
}

module.exports = {
  get_html_doc_from_array: get_html_doc_from_array,
  get_md_doc_from_array: get_md_doc_from_array,
  Documenter: Documenter
};
