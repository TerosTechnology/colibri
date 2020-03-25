const fs = require('fs');
const Simulators = require('../simulators/simulators')
const ParserLib = require('../parser/factory')
const nopy = require('nopy');
const path = require('path');
const dependency = require('./dependency_graph');
const run_python = require('./run_python');
const documenter = require('../documenter/documenter');

class Manager extends Simulators.Simulators{
  constructor(graph,configurator){
    let server_path = __dirname + path.sep + "server_triel.py"
    run_python.spawnPython([server_path], { interop: "buffer" }).then(({ code, stdout, stderr }) => {
    });
    super();
    this.source = [];
    this.testbench = [];
    if (typeof configurator === 'undefined')
      this.configurator = new Configurator();
    else
      this.configurator = configurator;
    this.dependency_graph = new dependency.Dependency_graph(graph);
  }
  loadProject(file){
    let jsonF = fs.readFileSync(file,'utf8');
    this.source = JSON.parse(jsonF)['src'];
    this.testbench = JSON.parse(jsonF)['tb'];
    this.configurator.setAll(JSON.parse(jsonF)['config']);
  }
  saveProject(file){
    let prj = {
      src : this.source,
      tb : this.testbench,
      config : this.configurator.getAll()
    };
    let data = JSON.stringify(prj);
    fs.writeFileSync(file,data);
  }
  getConfig(){
    return this.configurator.getAll();
  }
  clear(){
    this.source = [];
    this.testbench = [];
  }
  addSource(newSource){
    for (let i=0;i<newSource.length;++i) {
      let f = {
        name: newSource[i],
        file_type: this.getFileType(newSource[i])
      }
      this.source = this.source.concat(f);
    }
  }
  deleteSource(source){
    for(let i=0;i<source.length;++i)
      this.source = this.source.filter(function( obj ) {
          return obj.name !== source[i];
      });
  }
  addTestbench(newTestbench){
    for (let i=0;i<newTestbench.length;++i) {
      let f = {
        name: newTestbench[i],
        file_type: this.getFileType(newTestbench[i])
      }
      this.testbench = this.testbench.concat(f);
    }
  }
  deleteTestbench(testbench){
    for(let i=0;i<testbench.length;++i)
      this.testbench = this.testbench.filter(function( obj ) {
          return obj.name !== testbench[i];
      });
  }
  setConfiguration(configurator){
    this.configurator = configurator;
  }
  getSourceName(){
    let names = [];
    for(let i=0; i<this.source.length;++i)
      names = names.concat(this.source[i]['name']);
    return names;
  }
  getTestbenchName(){
    let names = [];
    for(let i=0; i<this.testbench.length;++i)
      names = names.concat(this.testbench[i]['name']);
    return names;
  }
  save_md_doc(output_dir_doc,symbol_vhdl,symbol_verilog,with_dependency_graph=false){
    let project_name = this.configurator.getName();
    let svg_dependency_graph = this.dependency_graph.get_dependency_graph_svg();
    documenter.get_md_doc_from_array(this.getSourceName(),output_dir_doc,symbol_vhdl,
                symbol_verilog,svg_dependency_graph,project_name,with_dependency_graph);
  }

  getFileType(f){
    if (typeof f != "string")
      return "none";
    let ext = f.split('.').pop();
    let file_type = "";
    if (ext == "py")
      file_type = "py"
    else if(ext == "v")
      file_type = "verilogSource-2005"
    else if(ext == "vhd")
      file_type = "vhdlSource-2008"
    return file_type;
  }
  getEdamFormat(){
    let edam = {
      'name': this.configurator.getName(),
      'suite': this.configurator.getSuite(),
      'tool' : this.configurator.getTool(),
      'working_dir' : this.configurator.getWorkingDir(),
      'top_level_file' : this.configurator.getTopLevelFile(),
      'top_level' : this.configurator.getTopLevel(),
      'files'  : this.source.concat(this.testbench),
      'gtkwave' : ''
    }
    return edam;
  }
  getSuites(server,port){
    return super.getSuites(server,port);
  }
  simulate(ip,port){
    let edam = this.getEdamFormat();
    return super.simulate(ip,port,edam);
  }
  get_entity(str,lang){
    let parser = new ParserLib.ParserFactory;
    parser = parser.getParser(lang,'');
    let structure =  parser.getAll(str);
    return structure['entity']['name'];
  }
  generate_svg(sources,function_open,top_level){
    this.dependency_graph.generate_svg(sources,function_open,top_level);
  }
  set_top_dependency_graph(file){
    this.dependency_graph.set_top_dependency_graph(file);
  }
}

class Configurator{
  constructor(){
    this.configuration = this.setDefaults();
  }
  setDefaults(){
    let configuration = {
      'suite':'',
      'tool':'',
      'language':'',
      'name':'',
      'top_level':'',
      'top_level_file':'',
      'working_dir':'',
      'gtkwave':''
    }
    return configuration;
  }
  setSuite(suite){
    if (typeof suite != 'string') {
        throw new Error('You must pass requiredParam to function setSuite!');
    }
    this.configuration["suite"] = suite;
  }
  setTool(tool){
    if (typeof tool != 'string') {
        throw new Error('You must pass requiredParam to function settool!');
    }
    this.configuration["tool"] = tool;
  }
  setLanguage(language){
    if (typeof language != 'string') {
        throw new Error('You must pass requiredParam to function setLanguage!');
    }
    this.configuration["language"] = language;
  }
  setName(name){
    if (typeof name != 'string') {
        throw new Error('You must pass requiredParam to function setName!');
    }
    this.configuration["name"] = name;
  }
  setTopLevel(topLevel){
    if (typeof topLevel != 'string') {
        throw new Error('You must pass requiredParam to function setTopLevel!');
    }
    this.configuration["top_level"] = topLevel;
  }
  setTopLevelFile(topLevelFile){
    if (typeof topLevelFile != 'string') {
        throw new Error('You must pass requiredParam to function setTopLevelFile!');
    }
    this.configuration["top_level_file"] = topLevelFile;
  }
  setWorkingDir(workingDir){
    if (typeof workingDir != 'string') {
        throw new Error('You must pass requiredParam to function setWorkingDir!');
    }
    this.configuration["working_dir"] = workingDir;
  }
  getSuite(){
    return this.configuration['suite'];
  }
  getTool(){
    return this.configuration['tool'];
  }
  getLanguage(){
    return this.configuration['language'];
  }
  getName(){
    return this.configuration['name'];
  }
  getTopLevel(){
    return this.configuration['top_level'];
  }
  getTopLevelFile(){
    return this.configuration['top_level_file'];
  }
  getWorkingDir(){
    return this.configuration['working_dir'];
  }
  getAll(){
    return this.configuration;
  }
  setAll(config){
    this.configuration = {
      'suite':config['suite'],
      'tool':config['tool'],
      'language':config['language'],
      'name':config['name'],
      'top_level':config['top_level'],
      'top_level_file':config['top_level_file'],
      'working_dir':config['working_dir'],
      'gtkwave':config['gtkwave']
    }
  }
}

module.exports = {
  Configurator   : Configurator,
  Manager : Manager
}
