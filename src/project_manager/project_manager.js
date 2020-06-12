
// Copyright 2019
// Carlos Alberto Ruiz Naranjo, Ismael Pérez Rojo,
// Alfredo Enrique Sáez Pérez de la Lastra
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

const fs = require('fs');
const Simulators = require('../simulators/simulators');
const ParserLib = require('../parser/factory');
// const nopy = require('nopy');
const path = require('path');
const dependency = require('./dependency_graph');
// const run_python = require('./run_python');
const documenter = require('../documenter/documenter');

class Manager extends Simulators.Simulators{
  constructor(graph,configurator,autosave_file){
    // let server_path = __dirname + path.sep + "server_triel.py"
    // run_python.spawnPython([server_path], { interop: "buffer" }).then(({ code, stdout, stderr }) => {
    // });
    super();
    this.source = [];
    this.testbench = [];
    this.autosave_file = autosave_file;
    if (configurator === undefined){
      this.configurator = new Configurator();
    }else{
      this.configurator = configurator;
    }
    this.dependency_graph = new dependency.Dependency_graph(graph);
  }
  load_project(file){
    let json_f = fs.readFileSync(file,'utf8');
    this.source = JSON.parse(json_f)['src'];
    this.testbench = JSON.parse(json_f)['tb'];
    this.configurator.set_all(JSON.parse(json_f)['config']);
    this.autosave();
  }
  autosave(){
    if (this.autosave_file !== undefined){
      this.save_project(this.autosave_file);
    }
  }
  save_project(file){
    let prj = {
      src : this.source,
      tb : this.testbench,
      config : this.configurator.get_all()
    };
    let data = JSON.stringify(prj);
    fs.writeFileSync(file,data);
  }
  get_config(){
    return this.configurator.get_all();
  }
  clear(){
    this.source = [];
    this.testbench = [];
    this.configurator = new Configurator();
    this.autosave();
  }
  add_source_from_array(newSource){
    for (let i=0;i<newSource.length;++i) {
      let f = {
        name: newSource[i],
        file_type: this.get_file_type(newSource[i])
      };
      this.source = this.source.concat(f);
    }
    this.autosave();
  }
  delete_source_from_array(source){
    for(let i=0;i<source.length;++i){
      this.source = this.source.filter(function( obj ) {
          return obj.name !== source[i];
      });
    }
    this.autosave();
  }
  add_testbench_from_array(newTestbench){
    for (let i=0;i<newTestbench.length;++i) {
      let f = {
        name: newTestbench[i],
        file_type: this.get_file_type(newTestbench[i])
      };
      this.testbench = this.testbench.concat(f);
    }
    this.autosave();
  }
  delete_testbench_from_array(testbench){
    for(let i=0;i<testbench.length;++i){
      this.testbench = this.testbench.filter(function( obj ) {
            return obj.name !== testbench[i];
      });
    }
    this.autosave();
  }
  set_configuration(configurator){
    this.configurator = configurator;
    this.autosave();
  }
  // eslint-disable-next-line no-unused-vars
  get_configurator(configurator){
    return this.configurator;
  }
  get_source_name(){
    let names = [];
    for(let i=0; i<this.source.length;++i){
      names = names.concat(this.source[i]['name']);
    }
    return names;
  }
  get_testbench_name(){
    let names = [];
    for(let i=0; i<this.testbench.length;++i){
      if (this.testbench[i] !== null){
        names = names.concat(this.testbench[i]['name']);
      }
    }
    return names;
  }
  save_markdown_doc(output_dir_doc,symbol_vhdl,symbol_verilog,with_dependency_graph=false){
    let project_name = this.configurator.get_name();
    let svg_dependency_graph;
    if (with_dependency_graph === true){
      svg_dependency_graph = this.dependency_graph.get_dependency_graph_svg();
    }
    documenter.get_md_doc_from_array(this.getSourceName(),output_dir_doc,symbol_vhdl,
                symbol_verilog,svg_dependency_graph,project_name,with_dependency_graph);
  }

  get_file_type(f){
    if (typeof f !== "string"){
      return "none";
    }
    let ext = f.split('.').pop();
    let file_type = "";
    if (ext === "py"){
      file_type = "py";
    }
    else if(ext === "v"){
      file_type = "verilogSource-2005";
    }
    else if(ext === "vhd"){
      file_type = "vhdlSource-2008";
    }
    return file_type;
  }
  get_edam_format(){
    let edam = {
      'name': this.configurator.get_name(),
      'suite': this.configurator.get_suite(),
      'tool' : this.configurator.get_tool(),
      'working_dir' : this.configurator.get_working_dir(),
      'top_level_file' : this.configurator.get_top_level_file(),
      'top_level' : this.configurator.get_top_level(),
      'files'  : this.source.concat(this.testbench),
      'gtkwave' : ''
    };
    return edam;
  }
  get_suites(server,port){
    return super.get_suites(server,port);
  }
  simulate(ip,port){
    let edam = this.get_edam_format();
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
  async get_dependency_graph_dot(){
    return await this.dependency_graph.create_dependency_graph(this.source);
  }
  set_top_dependency_graph(file){
    this.dependency_graph.set_top_dependency_graph(file);
    this.autosave();
  }
  check_project(){
    let errors = this.check_vunit();
    return errors;
    // if(){
    //
    // }
    // else if(){
    //
    // }
    // else if(){
    //
    // }
    // else{
    //
    // }
  }

  check_project_name(){
    let configurator = this.get_configurator();
    let error_sources_msg = [];
    //Check project name
    if (configurator.get_name() === ""){
      let msg = "Set your project name";
      error_sources_msg.push(msg);
    }
    return error_sources_msg;
  }

  check_vunit(){
    let errors = {
      'is_good' : true,
      'error_messages' : []
    };
    let error_sources_msg = [];

    //Check project name
    error_sources_msg = error_sources_msg.concat(this.check_project_name());

    //Check number of sources
    if (this.source.length !== 0){
      let msg = "Your current suite is VUnit. " +
      "Your project has " + this.source.length + " source files. " +
      "You don't need to add source files. Please, remove the source files.";
      error_sources_msg.push(msg);
    }
    //Check number of testbenches
    if (this.testbench.length !== 1){
      let msg = "Your current suite is VUnit. Your project has " +
                this.testbench.length + " testbench files. You only need " +
                "to add your VUnit script (run.py).";
      error_sources_msg.push(msg);
    }
    //Check .py extension
    else if (this.testbench.length === 1){
      let file_extension = path.extname(this.testbench[0]['name']);
      if (file_extension !== ".py"){
        let msg = "Your current suite is VUnit. Your testbench " +
                  "file extension isn't .py. You only need " +
                  "to add your VUnit script (run.py).";
        error_sources_msg.push(msg);
      }
    }
    errors['error_messages'] = error_sources_msg;
    if (error_sources_msg.length > 0){
      errors['is_good'] = false;
    }
    return errors;
  }
  check_standalone(){
    let errors = {
      'is_good' : true,
      'error_messages' : []
    };
    let error_sources_msg = [];

    //Check project name
    error_sources_msg.concat(this.check_project_name());

    errors['error_messages'] = error_sources_msg;
    if (error_sources_msg.length > 0){
      errors['is_good'] = false;
    }
    return errors;
  }
  check_cocotb(){
    let errors = {
      'is_good' : true,
      'error_messages' : []
    };
    let error_sources_msg = [];

    //Check project name
    error_sources_msg.concat(this.check_project_name());

    errors['error_messages'] = error_sources_msg;
    if (error_sources_msg.length > 0){
      errors['is_good'] = false;
    }
    return errors;
  }
}

class Configurator{
  constructor(){
    this.configuration = this.set_defaults();
  }
  set_defaults(){
    let configuration = {
      'suite':'',
      'tool':'',
      'language':'',
      'name':'',
      'top_level':'',
      'top_level_file':'',
      'working_dir':'',
      'gtkwave':''
    };
    return configuration;
  }
  seg_suite(suite){
    if (typeof suite !== 'string') {
        throw new Error('You must pass requiredParam to function setSuite!');
    }
    this.configuration["suite"] = suite;
  }
  set_tool(tool){
    if (typeof tool !== 'string') {
        throw new Error('You must pass requiredParam to function settool!');
    }
    this.configuration["tool"] = tool;
  }
  set_language(language){
    if (typeof language !== 'string') {
        throw new Error('You must pass requiredParam to function setLanguage!');
    }
    this.configuration["language"] = language;
  }
  set_name(name){
    if (typeof name !== 'string') {
        throw new Error('You must pass requiredParam to function setName!');
    }
    this.configuration["name"] = name;
  }
  set_top_level(topLevel){
    if (typeof topLevel !== 'string') {
        throw new Error('You must pass requiredParam to function setTopLevel!');
    }
    this.configuration["top_level"] = topLevel;
  }
  set_top_level_file(topLevelFile){
    if (typeof topLevelFile !== 'string') {
        throw new Error('You must pass requiredParam to function setTopLevelFile!');
    }
    this.configuration["top_level_file"] = topLevelFile;
  }
  set_woking_dir(workingDir){
    if (typeof workingDir !== 'string') {
        throw new Error('You must pass requiredParam to function setWorkingDir!');
    }
    this.configuration["working_dir"] = workingDir;
  }
  get_suite(){
    return this.configuration['suite'];
  }
  get_tool(){
    return this.configuration['tool'];
  }
  get_language(){
    return this.configuration['language'];
  }
  get_name(){
    return this.configuration['name'];
  }
  get_top_level(){
    return this.configuration['top_level'];
  }
  get_top_level_file(){
    return this.configuration['top_level_file'];
  }
  get_working_dir(){
    return this.configuration['working_dir'];
  }
  get_all(){
    return this.configuration;
  }
  set_all(config){
    this.configuration = {
      'suite':config['suite'],
      'tool':config['tool'],
      'language':config['language'],
      'name':config['name'],
      'top_level':config['top_level'],
      'top_level_file':config['top_level_file'],
      'working_dir':config['working_dir'],
      'gtkwave':config['gtkwave']
    };
  }
}

module.exports = {
  Configurator   : Configurator,
  Manager : Manager
};
