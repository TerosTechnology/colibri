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

class BaseStructure {
  constructor(str,lang,comment_symbol) {
    var parser = new ParserLib.ParserFactory;
    parser = parser.getParser(lang,comment_symbol);
    let structure = parser.getAll(str);
    if (structure == null){
      console.log("Error parsing");
      this.md = null;
      this.html = null;
    }
    else{
      this.structure =  structure;
      this.entity = this.structure['entity']['name'];
      this.entity_description = this.structure['entity']['comment'];
      this.ports = this.structure['ports'];
      this.generics = this.structure['generics'];

      this.md   = this.getMdDoc(null);
      this.html = this.getHtmlDoc(this.md);
    }
  }

  isAlive(){
    if (this.md == null)
      return false;
    else
      return true;
  }

  saveMarkdown(path){
    var file = pathLib.basename(path,pathLib.extname(path)) + ".svg";
    var pathSVG = pathLib.dirname(path) + pathLib.sep + file;
    this.saveSVG(pathSVG);
    fs.writeFileSync(path,this.getMdDoc(file));
  }
  savePdf(path){
    this.getPdfDoc(path);
  }
  saveHtml(path){
    fs.writeFileSync(path,this.html);
  }
  saveImage(){
  }
  saveSVG(path){
    fs.writeFileSync(path,this.getDiagram());
  }

  getDiagram(){
    var strDiagram = Diagram.diagramGenerator(this.structure,0);
    return strDiagram;
  }

  getPdfDoc(path) {
    var fileSVG = pathLib.basename(path,pathLib.extname(path)) + ".svg";
    var pathSVG = pathLib.dirname(path) + pathLib.sep + fileSVG;
    this.saveSVG(pathSVG);
    var mdDoc = this.getMdDoc(pathSVG);
    var markdownpdf = require("markdown-pdf")
    var options = {
      cssPath: __dirname + '/custom.css'
    }
    markdownpdf(options).from.string(mdDoc).to(path, function() {
      console.log("Created", path)
      try {
        fs.unlinkSync(pathSVG)
        //file removed
      } catch(err) {
        console.error(err)
      }
    })
  }

  getHtmlDoc(md) {
    var html = `
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

    var mdDoc = md;
    var showdown = require('showdown');
    showdown.setFlavor('github');
    var converter = new showdown.Converter({
      tables: true
    });
    html += converter.makeHtml(mdDoc);
    html += `<\div`
    return html;
  }

  getMdDoc(path) {
    var mdDoc = "";
    //Title
    mdDoc += "# Entity: " + this.entity + "\n";
    //Description
    mdDoc += "## Diagram\n";
    if (path == null){
      mdDoc += this.getDiagram();
    }
    else{
      mdDoc += '![Diagram](' + path + ' "Diagram")';
    }
    mdDoc += "\n"
    //Description
    mdDoc += "## Description\n";
    mdDoc  += this.entity_description;
    //Architecture
    mdDoc += "## Architectures\n";
    //Generics and ports
    mdDoc += this.getInOutSection();
    //Signals
    mdDoc += "## Signals\n";
    //constants
    mdDoc += "## Constants\n";
    //Processes
    mdDoc += "## Processes\n";

    return mdDoc;
  }

  getInOutSection() {
    var md = "";
    //Title
    md += "## Generics and ports\n";
    //Tables
    md += "### Table 1.1 Generics\n"
    md += this.getDocGenerics();
    md += "### Table 1.2 Ports\n"
    md += this.getDocPorts();
    return md;
  }

  getDocPorts() {
    const md = require('./markdownTable');
    var table = []
    table.push(["Port name", "Direction", "Type", "Description"])
    for (let i = 0; i < this.ports.length; ++i) {
      table.push([this.ports[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      this.ports[i]['direction'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      this.ports[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      this.ports[i]['comment'].replace(/ \r/g, ' ').replace(/\n/g, ' ')]);
    }
    var text = md(table) + '\n';
    return text;
  }

  getDocGenerics() {
    const md = require('./markdownTable');
    var table = []
    table.push(["Generic name", "Type", "Description"])
    for (let i = 0; i < this.generics.length; ++i) {
      table.push([this.generics[i]['name'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      this.generics[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' '),
      this.generics[i]['comment'].replace(/\r/g, ' ').replace(/\n/g, ' ')]);
    }
    var text = md(table) + '\n';
    return text;
  }
}

class StateMachineVHDL extends StmVHDL.StateMachineVHDL{
  getSVG(str) {
    const smcat = require("state-machine-cat")
    var go = this.getStateMachine(str);
    try {
      const lSVGInAString = smcat.render(
        go, {
          outputType: "svg"
        }
      );
      console.log(lSVGInAString);
    } catch (pError) {
      console.error(pError);
    }
    return go;
  }
}

class StateMachineVerilog extends StmVerilog.StateMachineVerilog{
  getSVG(str) {
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
    doc_inst.saveMarkdown(output_dir_doc + path.sep + filename + ".md");
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
  StateMachineVHDL: StateMachineVHDL,
  StateMachineVerilog : StateMachineVerilog
}
