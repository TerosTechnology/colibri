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
const fs = require('fs');
const pathLib = require('path');
const Diagram = require('./diagram')
const StmVHDL = require('./statemachinevhdl')
const StmVerilog = require('./statemachineverilog')
const ParserLib = require('../parser/factory')
const General = require('../general/general')

class BaseStructure {
  constructor(code,lang,comment_symbol) {
    this.lang = lang;
    this.code = code;
    this.comment_symbol = comment_symbol;
  }

  set_code(code){
    this.code = code;
  }

  set_lang(lang){
    this.lang = lang;
  }

  set_comment_symbol(comment_symbol){
    this.comment_symbol = comment_symbol;
  }

  async check_correct_file(){
    return true;
    let code_tree = await this._get_code_tree();
    if (code_tree == null)
      return false;
    else
      return true;
  }

  // ***************************************************************************
  async save_html(path){
    let html_doc = await this.get_html();
    fs.writeFileSync(path,html_doc);
  }
  async save_pdf(path){
    await this._get_pdf(path);
  }
  async save_svg(path){
    let svg_diagram_str = await this._get_diagram_svg();
    await fs.writeFileSync(path,svg_diagram_str);
  }
  async save_markdown(path){
    let file = pathLib.basename(path,pathLib.extname(path)) + ".svg";
    let path_svg = pathLib.dirname(path) + pathLib.sep + file;
    fs.writeFileSync(path,await this._get_markdown(file));
  }
  // ***************************************************************************
  async get_html(extra_top_space){
    let markdown_doc = await this._get_markdown(null, extra_top_space);
    let html_doc = await this._get_html_from_markdown(markdown_doc);
    return html_doc;
  }

  async _get_markdown(path, extra_top_space) {
    let extra_top_space_l = "";
    if (extra_top_space != null && extra_top_space != false){
      extra_top_space_l = "&nbsp;&nbsp;\n\n";
    }
    let code_tree = await this._get_code_tree();
    let markdown_doc = extra_top_space_l;
    //Title
    markdown_doc += "# Entity: " + code_tree['entity']['name'] + "\n";
    //Description
    markdown_doc += "## Diagram\n";
    if (path == null || path == ""){
      markdown_doc += await this._get_diagram_svg_from_code_tree(code_tree);
    }
    else{
      await this._save_svg_from_code_tree(path, code_tree);
      markdown_doc += '![Diagram](' + path + ' "Diagram")';
    }
    markdown_doc += "\n"
    //Description
    markdown_doc += "## Description\n";
    markdown_doc  += code_tree['entity']['comment'];
    // //Architecture
    // markdown_doc += "## Architectures\n";
    //Generics and ports
    markdown_doc += this._get_in_out_section(code_tree['ports'],code_tree['generics']);
    // //Signals
    // markdown_doc += "## Signals\n";
    // //constants
    // markdown_doc += "## Constants\n";
    // //Processes
    // markdown_doc += "## Processes\n";
    return markdown_doc;
  }

  async _get_html_from_markdown(markdown_str) {
    let html = `
    <style>
    #teroshdl h1,#teroshdl h2,#teroshdl h3,#teroshdl table {margin-left:5%;}
    div.templateTerosHDL { background-color: white;position:absolute; }
    #teroshdl td,#teroshdl th,#teroshdl h1,#teroshdl h2,#teroshdl h3 {color: black;}
    #teroshdl h1,#teroshdl h2 {font-weight:bold;}
    #teroshdl tr:hover {background-color: #ddd;}
    #teroshdl td, #teroshdl th {
        border: 1px solid grey
    }
    #teroshdl p {color:black;}
    #teroshdl p {margin:5%;}
    #teroshdl th { background-color: #ffd78c;}
    #teroshdl tr:nth-child(even){background-color: #f2f2f2;}
    </style>
    <div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%" >
    `

    let showdown = require('showdown');
    showdown.setFlavor('github');
    let converter = new showdown.Converter({
      tables: true
    });
    html += converter.makeHtml(markdown_str);
    html += `<\div`
    return html;
  }

  async _get_pdf(path) {
    let code_tree = await this._get_code_tree();

    let file_svg = pathLib.basename(path,pathLib.extname(path)) + ".svg";
    let path_svg = pathLib.dirname(path) + pathLib.sep + file_svg;
    await this._save_svg_from_code_tree(path_svg, code_tree);
    let markdown_doc = await this._get_markdown(path_svg);
    let markdownpdf = require("markdown-pdf")
    let options = {
      cssPath: __dirname + '/custom.css'
    }
    markdownpdf(options).from.string(markdown_doc).to(path, function() {
      try {
        fs.unlinkSync(path_svg)
      } catch(err) {
        console.error(err)
      }
    })
  }

  async _get_diagram_svg(){
    let code_tree = await this._get_code_tree();
    return await Diagram.diagramGenerator(code_tree,0);
  }

  async _get_diagram_svg_from_code_tree(code_tree){
    let svg_diagram_str = await Diagram.diagramGenerator(code_tree,0);
    return svg_diagram_str;
  }

  async _save_svg_from_code_tree(path, code_tree){
    let svg_diagram_str = await this._get_diagram_svg_from_code_tree(code_tree);
    await fs.writeFileSync(path,svg_diagram_str);
  }

  async _get_code_tree(){
    let parser = new ParserLib.ParserFactory;
    parser = parser.getParser(this.lang,this.comment_symbol);
    let code_tree = await parser.getAll(this.code);
    return code_tree;
  }

  async _gen_code_tree(){
    this.code_tree = this._get_code_tree();
  }

  _get_in_out_section(ports,generics) {
    let md = "";
    //Title
    md += "## Generics and ports\n";
    //Tables
    md += "### Table 1.1 Generics\n"
    md += this._get_doc_generics(generics);
    md += "### Table 1.2 Ports\n"
    md += this._get_doc_ports(ports);
    return md;
  }

  _get_doc_ports(ports) {
    const md = require('./markdownTable');
    let table = []
    table.push(["Port name", "Direction", "Type", "Description"])
    for (let i = 0; i < ports.length; ++i) {
      table.push([ports[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      ports[i]['direction'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      ports[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      ports[i]['comment'].replace(/ \r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }

  _get_doc_generics(generics) {
    const md = require('./markdownTable');
    let table = []
    table.push(["Generic name", "Type", "Description"])
    for (let i = 0; i < generics.length; ++i) {
      table.push([generics[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      generics[i]['comment'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    let text = md(table) + '\n';
    return text;
  }
}

function get_state_machine_hdl_svg(str,lang){
  let state_machine_cl;
  if (lang == General.LANGUAGES.VHDL){
    state_machine_cl = new State_machine_vhdl();
  }
  else if (lang == General.LANGUAGES.VERILOG){
    state_machine_cl = new State_machine_verilog();
  }
  else
    return null

  let state_machine_svg;
  try{
    state_machine_svg = state_machine_cl.get_svg(str)
  }
  catch(error){
    return null;
  }

  return state_machine_svg;
}

class State_machine_vhdl extends StmVHDL.State_machine_vhdl{
  get_svg(str) {
    const smcat = require("state-machine-cat")
    let go = this.getStateMachine(str);
    try {
      const svg = smcat.render(
        go, {
          outputType: "svg"
        }
      );
      return svg;
    } catch (pError) {
      console.error(pError);
      return null;
    }
  }
}

class State_machine_verilog extends StmVerilog.State_machine_verilog{
  get_svg(str) {
    return null;
  }
}

function get_md_doc_from_array(files,output_dir_doc,symbol_vhdl,symbol_verilog,
          graph,project_name,with_dependency_graph){
  //Main doc
  let main_doc = "# Project documentation: " + project_name + "\n"
  let lang = "vhdl";
  let symbol = "!";
  let doc  = [];
  for (let i=0;i<files.length;++i){
    let filename = pathLib.basename(files[i],pathLib.extname(files[i]));
    if(pathLib.extname(files[i]) == '.vhd'){
      lang = "vhdl";
      symbol = symbol_vhdl;
    }
    else if(pathLib.extname(files[i]) == '.v'){
      lang = "verilog";
      symbol = symbol_verilog;
    }
    else
      break;
    main_doc += "- [" + filename + "](./" + filename + ".md)\n";

    let contents = fs.readFileSync(files[i], 'utf8');

    let doc_inst = new BaseStructure(contents,lang,symbol);
    doc_inst.save_markdown(output_dir_doc + path.sep + filename + ".md");
  }
  if (with_dependency_graph == true){
    main_doc += "# Project dependency graph\n"
    main_doc += '![system](./dependency_graph.svg "System")'
    fs.writeFileSync(output_dir_doc + pathLib.sep + "dependency_graph.svg",graph);
  }
  fs.writeFileSync(output_dir_doc + pathLib.sep + "README.md",main_doc);
}

module.exports = {
  get_md_doc_from_array : get_md_doc_from_array,
  BaseStructure: BaseStructure,
  get_state_machine_hdl_svg: get_state_machine_hdl_svg
}
