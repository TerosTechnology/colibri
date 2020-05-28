"use babel"

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

const d3 = require('d3-graphviz');
const d3_selection = require('d3-selection');
const d3_ease = require('d3-ease');
const d3_transition = require('d3-transition');
const d3_chromatic = require('d3-scale-chromatic');
const shell = require('child_process');
const nopy = require('nopy');

class Dependency_graph {
  constructor(graph){
    this.graph = graph;
    this.dependency_graph_svg = "";
  }

  generate_svg(files,open_function,top){
    if (this.graph == undefined)
      this.graph = document.createElement("div");
    this.graph.setAttribute("id", "#graph");
    this.graph.setAttribute("style", "background-color:white;width=900px;height=900px");
    let element = this;
    this.create_dependency_graph(files).then( async function (dependency_graph) {
      d3_selection.select(this.graph).on("click", function() {
        if(event['path'][1]['id'] == "graph0")
        return;
        let children = event['path'][2]['children']
        for (let i=0;i<children.length;++i){
          if(children[i]['childNodes'][3] != null && children[i]['classList'][0]!=='edge'
          && children[i]['classList']['value']!==""){
            children[i]['childNodes'][3]['attributes'][0]['value'] = 'lightgray'
          }
        }
        let g = event['path'][1];
        let node_path = g.getElementsByTagName("title")[0]['innerHTML'];
        let node_name = g.getElementsByTagName("text")[0]['innerHTML'];
        let rectangle = g.getElementsByTagName("polygon");
        rectangle[0]['attributes'][0]['value'] = "red"
        open_function(node_path);
      });
      let t = d3_transition.transition().duration(700).ease(d3_ease.easeLinear);
      if (dependency_graph == "")
        return;
      element.dependency_graph = dependency_graph;
      d3.graphviz(element.graph).transition(t).height(window.innerHeight).width(window.innerWidth)
      .renderDot(dependency_graph).on("end", function(event) {
        if (top != undefined)
          element.set_top_dependency_graph(top);
      });
    });
  }

  get_dependency_graph_svg(){
    let svg = document.createElement("svg");
    d3.graphviz(svg).renderDot(this.dependency_graph);
    console.log(svg);
    return svg.childNodes[0].outerHTML;
  }

  create_dependency_graph(sources) {
    let str = "";
    for (let i=0;i<sources.length-1;++i)
    str += sources[i] + ","
    str += sources[sources.length-1];

    let py_path = __dirname + path.sep + "vunit_dependency.py"
    return new Promise(function(resolve, reject) {
      nopy.spawnPython([py_path, str], { interop: "buffer" }).then(({ code, stdout, stderr }) => {
        resolve(stdout);
      })
    });
  }

  set_top_dependency_graph(file) {
    try{
      let selection = d3_selection.select(this.graph);
      let childs = selection['_groups'][0][0]['childNodes'][0]['childNodes'][1]['childNodes'];
      for (let i=0;i<childs.length;++i){
        if(childs[i]['childNodes'][3] != null && childs[i]['classList'][0]!=='edge'
        && childs[i]['classList']['value']!==""){
          if (childs[i]['childNodes'].length>2){
            if (childs[i]['childNodes'][1]['innerHTML']==file){
              childs[i]['childNodes'][3]['attributes'][0]['value'] = 'red'
            }
            else{
              childs[i]['childNodes'][3]['attributes'][0]['value'] = 'lightgray'
            }
          }
        }
      }
    }
    catch(error){console.log(error)}
  }
}

module.exports = {
  Dependency_graph : Dependency_graph,
}
