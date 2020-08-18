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
const path_lib = require('path');
const Diagram = require('./diagram');
const StmVHDL = require('./statemachinevhdl');
const StmVerilog = require('./statemachineverilog');
const ParserLib = require('../parser/factory');
const General = require('../general/general');
const showdown = require('showdown');
const json5 = require('json5');

class Documenter {
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

  // ***************************************************************************
  // options = {"custom_css_path":"/custom_css/path"}
  async save_html(path,options){
    let html_doc = await this.get_html(options);
    fs.writeFileSync(path,html_doc);
  }
  // options = {"custom_css_path":"/custom_css/path"}
  async save_pdf(path,options){
    await this._get_pdf(path,options);
  }
  async save_svg(path){
    let svg_diagram_str = await this._get_diagram_svg();
    await fs.writeFileSync(path,svg_diagram_str);
  }
  async save_markdown(path){
    let file = path_lib.dirname(path) + path_lib.sep + path_lib.basename(path,path_lib.extname(path)) + ".svg";
    fs.writeFileSync(path,await this._get_markdown(file));
  }
  // ***************************************************************************
  async get_html(options){
    let html_doc = await this._get_html_from_code(options);
    return html_doc;
  }

  async _get_markdown(path, extra_top_space) {
    let extra_top_space_l = "";
    if (extra_top_space !== null && extra_top_space !== false){
      extra_top_space_l = "&nbsp;&nbsp;\n\n";
    }
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined){
      return "";
    }
    let markdown_doc = extra_top_space_l;
    //Title
    markdown_doc += "# Entity: " + code_tree['entity']['name'] + "\n";
    //Description
    markdown_doc += "## Diagram\n";
    await this._save_svg_from_code_tree(path, code_tree);
    markdown_doc += '![Diagram](' + path_lib.basename(path) + ' "Diagram")';
    markdown_doc += "\n";
    //Description
    markdown_doc += "## Description\n";
    markdown_doc  += code_tree['entity']['comment'];
    // markdown_doc  += this._get_wavedrom_svg(code_tree['entity']['comment']);

    //Generics and ports
    markdown_doc += this._get_in_out_section(code_tree['ports'],code_tree['generics']);
    return markdown_doc;
  }

  // async _get_markdown_incrusted_svg_from_code_tree(code_tree, extra_top_space) {
  //   let markdown_doc = "&nbsp;&nbsp;\n\n";
  //   //Title
  //   markdown_doc += "# Entity: " + code_tree['entity']['name'] + "\n";
  //   //Description
  //   markdown_doc += "## Diagram\n";
  //   // markdown_doc += await this._get_diagram_svg_from_code_tree(code_tree) + "\n";
  //   //Description
  //   markdown_doc += "## Description\n";
  //   markdown_doc  += this._get_wavedrom_svg(code_tree['entity']['comment']);
  //   // markdown_doc  += code_tree['entity']['comment'];
  //   //Generics and ports
  //   markdown_doc += this._get_in_out_section(code_tree['ports'],code_tree['generics']);
  //   return markdown_doc;
  // }

  async _get_html_from_code(options) {
    let html_style = `
<style>
  #teroshdl h1,#teroshdl h2,#teroshdl h3,#teroshdl table, #teroshdl svg {margin-left:5%;}
  div.templateTerosHDL { background-color: white;position:absolute; }
  #teroshdl td,#teroshdl th,#teroshdl h1,#teroshdl h2,#teroshdl h3 {color: black;}
  #teroshdl h1,#teroshdl h2 {font-weight:bold;}
  #teroshdl tr:hover {background-color: #ddd;}
  #teroshdl td, #teroshdl th {
    border: 1px solid grey
  }
  #teroshdl p {color:black;}
  #teroshdl p {margin-left:5%;}
  #teroshdl th { background-color: #ffd78c;}
  #teroshdl tr:nth-child(even){background-color: #f2f2f2;}
</style>
<div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%">\n`;

    //HTML style
    let html = "";
    if (options !== undefined && options.custom_css_path !== undefined){
      try{
        let custom_css_str = fs.readFileSync(options.custom_css_path, {encoding:'utf8'});
        html = `<style>\n${custom_css_str}</style>\n`;
        html += `<div id="teroshdl" class='templateTerosHDL' style="overflow-y:auto;height:100%;width:100%">\n`;
      }
      catch(e){
        // eslint-disable-next-line no-console
        console.log(e);
        html = html_style;
      }
    }
    else{
      html = html_style;
    }
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined){
      return html;
    }

    let converter = new showdown.Converter({tables: true, ghCodeBlocks: true});
    converter.setFlavor('github');
    // html += converter.makeHtml(markdown);


    html += converter.makeHtml("&nbsp;&nbsp;\n\n");
    //Title
    html += converter.makeHtml("# Entity: " + code_tree['entity']['name'] + "\n");
    //Description
    html += converter.makeHtml("## Diagram\n");
    html += converter.makeHtml(await this._get_diagram_svg_from_code_tree(code_tree) + "\n");
    //Description
    html += converter.makeHtml("## Description\n");
    const {description, wavedrom} = this._get_wavedrom_svg(code_tree['entity']['comment']);

    let html_description = converter.makeHtml(description);

    for(let i=0;i<wavedrom.length;++i){
      html_description = html_description.replace("$cholosimeone$"+i,wavedrom[i]);
    }
    // html_description = html_description.replace("$cholosimeone$",wavedrom);
    html += html_description;
    //Generics and ports
    html += converter.makeHtml(this._get_in_out_section(code_tree['ports'],code_tree['generics']));

    return html;
  }

  _generics_to_html_table(generics){
    let html = `
<table>
  <thead>
    <tr>
      <th id="port_name">Generic name</th>
      <th id="type">Type</th>
      <th id="description">Description</th>
    </tr>
  <thead>
  <tbody>`;

  for (let i=0; i<generics.length; ++i){
    html += `
    <tr>
      <td>${generics[i].name}</td>
      <td>${generics[i].type}</td>
      <td>${generics[i].comment}</td>
    <tr>`;
  }
    html += `
  </tbody>
</table>`;
    return html;
  }

  _ports_to_html_table(ports){
    let html = `
<table>
  <thead>
    <tr>
      <th id="port_name">Port name</th>
      <th id="direction">Direction</th>
      <th id="type">Type</th>
      <th id="description">Description</th>
    </tr>
  <thead>
  <tbody>`;

  for (let i=0; i<ports.length; ++i){
    html += `
    <tr>
      <td>${ports[i].name}</td>
      <td>${ports[i].direction}</td>
      <td>${ports[i].type}</td>
      <td>${ports[i].comment}</td>
    <tr>`;
  }
    html += `
  </tbody>
</table>`;
    return html;
  }

  async _get_pdf(path,options) {
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined){
      return;
    }

    let file_svg = path_lib.basename(path,path_lib.extname(path)) + ".svg";
    let path_svg = path_lib.dirname(path) + path_lib.sep + file_svg;
    await this._save_svg_from_code_tree(path_svg, code_tree);
    let markdown_doc = await this._get_markdown(path_svg);
    let markdownpdf = require("markdown-pdf");
  
    let options_md_pdf = {
      cssPath: __dirname + path_lib.sep + 'custom.css'
    };
    if (options !== undefined && options.custom_css_path !== undefined){
      options_md_pdf.cssPath = options.custom_css_path;
    }

    markdownpdf(options_md_pdf).from.string(markdown_doc).to(path, function() {
      try {
        fs.unlinkSync(path_svg);
      } catch(err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
  }

  async _get_diagram_svg(){
    let code_tree = await this._get_code_tree();
    if (code_tree === undefined){
      return;
    }
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
    parser = await parser.getParser(this.lang,this.comment_symbol);
    let code_tree = await parser.getAll(this.code);
    return code_tree;
  }

  async _gen_code_tree(){
    this.code_tree = await this._get_code_tree();
  }

  _get_wavedrom_svg(description){
    //regex wavedrom
    const regex = /(\{([ ]+|)signal([ ]+|)+:([ ]+|)\[[^]+\})/gm;
    let match;
    let wavedrom_diagram = [];
    let counter = 0;

    let description_normalized = description.replace(/{[ \t]*signal[ \t]*:[ \t]*\[/gm,"{signal:[");
    let description_replace = description_normalized;


    let description_replace_split = description_normalized.split(/{[ \t]*signal[ \t]*:[ \t]*\[/gm);
    if (description_replace_split.length === 0){
      return {description: description_normalized, wavedrom: wavedrom_diagram};
    }

    for (let x=0; x<description_replace_split.length;++x){
      let description_replace_split_inst = "{signal:[" + description_replace_split[x];
      while ((match = regex.exec(description_replace_split_inst)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        if ( match !== null && match[0] !== null){
          let normalized_diagram = match[0];
          normalized_diagram = normalized_diagram.replace(/\\"/g,'"');
          let normalized_diagram_json5 = json5.parse(normalized_diagram);
  
          let wavedrom = require('wavedrom');
          let diagram = wavedrom.renderAny(0,normalized_diagram_json5,wavedrom.waveSkin);
  
          let onml = require('onml');
          let diagram_svg = onml.s(diagram);
          wavedrom_diagram.push(diagram_svg);

          description_replace = description_replace.replace(match[0],"\n" + "$cholosimeone$" + counter + " \n");
          counter += 1;
        }
      }
    }
    
    return {description: description_replace, wavedrom: wavedrom_diagram};
  }

  _get_in_out_section(ports,generics) {
    let md = "";
    //Title
    md += "## Generics and ports\n";
    //Tables
    md += "### Table 1.1 Generics\n";
    if (generics.length !== 0){
      md += this._get_doc_generics(generics);
    }
    md += "### Table 1.2 Ports\n";
    if (ports.length !== 0){
      md += this._get_doc_ports(ports);
    }
    return md;
  }

  _get_doc_ports(ports) {
    const md = require('./markdownTable');
    let table = [];
    table.push(["Port name", "Direction", "Type", "Description"]);
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
    let table = [];
    table.push(["Generic name", "Type", "Description"]);
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
  if (lang === General.LANGUAGES.VHDL){
    state_machine_cl = new State_machine_vhdl();
  }
  else if (lang === General.LANGUAGES.VERILOG){
    state_machine_cl = new State_machine_verilog();
  }
  else{
    return null;
  }

  let state_machine_svg;
  try{
    state_machine_svg = state_machine_cl.get_svg(str);
  }
  catch(error){
    return null;
  }

  return state_machine_svg;
}

class State_machine_vhdl extends StmVHDL.State_machine_vhdl{
  get_svg(str) {
    const smcat = require("state-machine-cat");
    let go = this.getStateMachine(str);
    try {
      const svg = smcat.render(
        go, {
          outputType: "svg"
        }
      );
      return svg;
    } catch (pError) {
      // eslint-disable-next-line no-console
      console.error(pError);
      return undefined;
    }
  }
}

class State_machine_verilog extends StmVerilog.State_machine_verilog{
  // eslint-disable-next-line no-unused-vars
  get_svg(str) {
    return undefined;
  }
}

function get_md_doc_from_array(files,output_dir_doc,symbol_vhdl,symbol_verilog,
          graph,project_name,with_dependency_graph){
  //Main doc
  let main_doc = "# Project documentation: " + project_name + "\n";
  let lang = "vhdl";
  let symbol = "!";
  for (let i=0;i<files.length;++i){
    let filename = path_lib.basename(files[i],path_lib.extname(files[i]));
    if(path_lib.extname(files[i]) === '.vhd'){
      lang = "vhdl";
      symbol = symbol_vhdl;
    }
    else if(path_lib.extname(files[i]) === '.v'){
      lang = "verilog";
      symbol = symbol_verilog;
    }
    else
      {break;}
    main_doc += "- [" + filename + "](./" + filename + ".md)\n";

    let contents = fs.readFileSync(files[i], 'utf8');

    let doc_inst = new Documenter(contents,lang,symbol);
    doc_inst.save_markdown(output_dir_doc + path_lib.sep + filename + ".md");
  }
  if (with_dependency_graph === true){
    main_doc += "# Project dependency graph\n";
    main_doc += '![system](./dependency_graph.svg "System")';
    fs.writeFileSync(output_dir_doc + path_lib.sep + "dependency_graph.svg",graph);
  }
  fs.writeFileSync(output_dir_doc + path_lib.sep + "README.md",main_doc);
}

module.exports = {
  get_md_doc_from_array : get_md_doc_from_array,
  Documenter: Documenter,
  get_state_machine_hdl_svg: get_state_machine_hdl_svg
};
