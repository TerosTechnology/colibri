const codes = require('../db/codes')
const diagram = require('./diagram')

class BaseStructure {
  constructor(structure) {
    this.structure = structure;
    this.entity = structure['entity']['name'];
    this.ports = structure['ports'];
    this.generics = structure['generics'];

    this.md   = this.getMdDoc(null);
    this.html = this.getHtmlDoc(this.md);

    var os = require('os');
    if (os.platform == "win32"){
      this.separator = "\\"
    }
    else{
      this.separator = "/"
    }
  }

  getDiagram(){
    var strDiagram = diagram.diagramGenerator(this.structure,0);
    return strDiagram;
  }

  getPdfDoc(path) {
    var pdfPath = path + this.separator + "terosDoc.pdf"
    var mdDoc = this.getMdDoc(path);

    var markdownpdf = require("markdown-pdf")
    var options = {
      cssPath: __dirname + '/custom.css'
    }
    markdownpdf(options).from.string(mdDoc).to(pdfPath, function() {
      console.log("Created", pdfPath)
    })
  }

  getHtmlDoc(md) {
    var html = `
    <style>
    h1,h2,h3,svg,table {margin-left:5%;}
    div.template { background-color: white;position:absolute; }
    td,th,h1,h2,h3 {color: black;}
    h1,h2 {font-weight:bold;}
    svg {width: 100%;}
    tr:hover {background-color: #ddd;}
    td, th {
        border: 1px solid grey
    }
    th { background-color: #ffd78c;}
    tr:nth-child(even){background-color: #f2f2f2;}
    </style>
    <div class='template' style="overflow-y:auto;height:100%;width:100%" >
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
      var svgPath = path + this.separator + "terosOutDocModule.svg"
      var svg = this.getDiagram();
      const fs = require('fs');
      fs.writeFileSync(svgPath,svg);
      mdDoc += '![Diagram](' + svgPath + ' "Diagram")';
    }
    mdDoc += "\n"
    //Description
    mdDoc += "## Description\n";
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
      table.push([this.ports[i]['name'], this.ports[i]['direction'], this.ports[i]['type'], ""]);
    }
    var text = md(table) + '\n';
    return text;
  }

  getDocGenerics() {
    const md = require('./markdownTable');
    var table = []
    table.push(["Generic name", "Type", "Description"])
    for (let i = 0; i < this.generics.length; ++i) {
      table.push([this.generics[i]['name'], this.generics[i]['type'], ""]);
    }
    var text = md(table) + '\n';
    return text;
  }
}

class BaseStateMachine {
  getSvgStateMachine(str) {
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

module.exports = {
  BaseStructure: BaseStructure,
  BaseStateMachine: BaseStateMachine
}
