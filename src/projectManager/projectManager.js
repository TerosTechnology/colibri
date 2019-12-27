const fs = require('fs');
const Simulators = require('../simulators/simulators')

class ProjectManager extends Simulators.Simulators{
  constructor(configurator){
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
  }
  saveProject(file){
    var prj = {
      src : this.source,
      tb : this.testbench
    };
    var data = JSON.stringify(prj);
    fs.writeFileSync(file,data);
  }
  clear(){
    this.source = [];
    this.testbench = [];
    // this.configurator = new Configurator();
  }
  addSource(newSource){
    console.log("Added source...");
    for (const x in newSource) {
      var f = {
        name: newSource[x],
        type: this.getFileType(newSource[x])
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
    for (const x in newTestbench) {
      var f = {
        name: newTestbench[x],
        type: this.getFileType(newTestbench[x])
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
    for (const x in this.source) {
      names = names.concat(this.source[x]['name']);
    }
    return names;
  }
  getTestbenchName(){
    var names = [];
    for (const x in this.testbench) {
      names = names.concat(this.testbench[x]['name']);
    }
    return names;
  }
  getFileType(f){
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
  simulate(serverIP,serverPort){
    var edam = this.getEdamFormat();
    var sim = new jsTeros.Simulators.Manager(serverIP,serverPort);
    sim.runTool(edam).then(function(response) {
      console.log(response)
      return response;
    }, function() {
      // failed
    });
  }
  getEdamFormat(){
    var edam = {
      'name': this.configurator.getName(),
      'suite': this.configurator.getSuite(),
      'tool' : this.configurator.getTool(),
      'working_dir' : this.configurator.getWorkingDir(),
      'top_level' : this.configurator.getTopLevel(),
      'files'  : this.source.concat(this.testbench)
    }
    return edam;
  }
  getSuites(server,port){
    return super.getSuites(server,port);
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
      'working_dir':''
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
    this.configuration["topLevel"] = topLevel;
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
  getWorkingDir(){
    return this.configuration['working_dir'];
  }
}

module.exports = {
  ProjectManager : ProjectManager
}