const fs = require('fs');
const Simulators = require('../simulators/simulators')
const ParserLib = require('../parser/factory')
const nopy = require('nopy');
const path = require('path');

class Manager extends Simulators.Simulators{
  constructor(configurator){
    var server_path = __dirname + path.sep + "test.py"
    nopy.spawnPython([server_path], { interop: "buffer" }).then(({ code, stdout, stderr }) => {
    });
    super();
    this.source = [];
    this.testbench = [];
    if (typeof configurator === 'undefined')
      this.configurator = new Configurator();
    else
      this.configurator = configurator;
  }
  loadProject(file){
    var jsonF = fs.readFileSync(file,'utf8');
    this.source = JSON.parse(jsonF)['src'];
    this.testbench = JSON.parse(jsonF)['tb'];
    this.configurator.setAll(JSON.parse(jsonF)['config']);
  }
  saveProject(file){
    var prj = {
      src : this.source,
      tb : this.testbench,
      config : this.configurator.getAll()
    };
    var data = JSON.stringify(prj);
    fs.writeFileSync(file,data);
  }
  getConfig(){
    return this.configurator.getAll();
  }
  clear(){
    this.source = [];
    this.testbench = [];
    // this.configurator = new Configurator();
  }
  addSource(newSource){
    console.log("Added source...");
    for (var i=0;i<newSource.length;++i) {
      var f = {
        name: newSource[i],
        file_type: this.getFileType(newSource[i])
      }
      this.source = this.source.concat(f);
    }
  }
  deleteSource(source){
    for(var i=0;i<source.length;++i)
      this.source = this.source.filter(function( obj ) {
          return obj.name !== source[i];
      });
  }
  addTestbench(newTestbench){
    console.log("Added testbench...");
    for (var i=0;i<newTestbench.length;++i) {
      var f = {
        name: newTestbench[i],
        file_type: this.getFileType(newTestbench[i])
      }
      this.testbench = this.testbench.concat(f);
    }
  }
  deleteTestbench(testbench){
    for(var i=0;i<testbench.length;++i)
      this.testbench = this.testbench.filter(function( obj ) {
          return obj.name !== testbench[i];
      });
  }
  setConfiguration(configurator){
    this.configurator = configurator;
  }
  getSourceName(){
    var names = [];
    for(var i=0; i<this.source.length;++i)
      names = names.concat(this.source[i]['name']);
    return names;
  }
  getTestbenchName(){
    var names = [];
    for(var i=0; i<this.testbench.length;++i)
      names = names.concat(this.testbench[i]['name']);
    return names;
  }
  getFileType(f){
    if (typeof f != "string")
      return "none";
    var ext = f.split('.').pop();
    var file_type = "";
    if (ext == "py")
      file_type = "py"
    else if(ext == "v")
      file_type = "verilogSource-2005"
    else if(ext == "vhd")
      file_type = "vhdlSource-2008"
    return file_type;
  }
  getEdamFormat(){
    var edam = {
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
    var edam = this.getEdamFormat();
    return super.simulate(ip,port,edam);
  }
  get_entity(str,lang){
    var parser = new ParserLib.ParserFactory;
    parser = parser.getParser(lang,'');
    var structure =  parser.getAll(str);
    return structure['entity']['name'];
  }
}

class Configurator{
  constructor(){
    this.configuration = this.setDefaults();
  }
  setDefaults(){
    var configuration = {
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
