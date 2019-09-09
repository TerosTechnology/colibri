function diagramGenerator(structure,bn){
  const fs       = require('fs');
  const window   = require('svgdom')
  const SVG      = require('svg.js')

  var ns = 'http://www.w3.org/2000/svg'
  var div = document.getElementById('drawing')
  var svg = document.createElementNS(ns, 'svg')
  const canvas = SVG(svg)

  var border  = 'black'
  var genBox  = '#bdecb6'  //'blue'
  var portBox = '#fdfd96'  //'red'
  var locx  = 200
  var locy  = 0
  var width = 100
  var high  = 100
  var size  = 20
  var font='Helvetica'
  var offset = 10
  var text_space = 15
  var text_space_pin = text_space/3
  var separator = 10
  var name = 0
  var kind = 1
  var generics=[[],[]]
  var inPorts=[[],[]]
  var outPorts=[[],[]]

  if (bn==1) {
    var border  = 'black'
    var genBox  = 'white'
    var portBox = 'white'
  }

  generics=getGenerics(structure,name, kind);
  inPorts=getPorts(structure,name,kind,'in');
  outPorts=getPorts(structure,name,kind,'out');
  locx=(size/2)*maxString(generics,inPorts,[0,0],kind)
  width=(size)*maxString(generics,inPorts,outPorts,name)

  //generic square
  high = size*generics[0].length
  if (generics[0].length>0) {
    var recta = canvas.rect(width,high+offset).fill(border).move(locx,locy)
    canvas.rect(width-4,high+offset/2).fill(genBox).move(locx+2,locy+2)
    //write generics
    for (let i = 0; i < generics[0].length; i++) {
      locy=size*i
      var textleft=canvas.text(generics[kind][i]).move(locx-text_space-text_space_pin,locy).font({family:   font, size: size, anchor:   'end'})
      var textleft=canvas.text(generics[name][i]).move(locx+text_space,locy).font({family:   font, size: size, anchor:   'start'})
      var pins=canvas.line(locx-text_space,0, locx, 0 ).move(locx-text_space,locy+size*3/4).stroke({ color: 'black', width: size/4, linecap: 'rec' })
    }
  }
  //ports square
  locy=high+offset+separator
  high = size*Math.max(inPorts[0].length,outPorts[0].length)
  var recta = canvas.rect(width,high+offset).fill(border).move(locx,locy)
  canvas.rect(width-4,high+offset/2).fill(portBox).move(locx+2,locy+2)
  //write ports
  for (let i = 0; i < inPorts[0].length; i++) {
    locy=size*generics[0].length+offset+size*i+separator
    var textleft = canvas.text(inPorts[kind][i]).move(locx-text_space-text_space_pin,locy).font({family:   font, size: size, anchor:   'end'})
    var textleft = canvas.text(inPorts[name][i]).move(locx+text_space,locy).font({family:   font, size: size, anchor:   'start'})
    var pins=canvas.line(locx-text_space,0, locx, 0 ).move(locx-text_space,locy+size*3/4).stroke({ color: 'black', width: size/4, linecap: 'rec' })
  }
  for (let i = 0; i < outPorts[0].length; i++) {
    locy=size*generics[0].length+offset+size*i+separator
    var textright= canvas.text(outPorts[kind][i]).move(locx+width+text_space+text_space_pin,locy).font({family:   font, size: size, anchor:   'start'})
    var textright= canvas.text(outPorts[name][i]).move(locx+width-text_space,locy).font({family:   font, size: size, anchor:   'end'})
    var pins=canvas.line(locx-text_space,0, locx, 0 ).move(locx+width,locy+size*3/4).stroke({ color: 'black', width: size/4, linecap: 'rec' })
  }

  return canvas.svg();
}

function getGenerics(structure,name,kind){
  var str = [[],[]]
  for (let x = 0; x <= structure.generics.length-1; ++x){
    str[name][x] = '   ' + structure.generics[x]['name'] + ' ';
    str[kind][x] = '   ' + structure.generics[x]['type'] + ' ';
  }
  return str
}

function getPorts(structure,name,kind,inout){
  var str_in= [[],[]]
  var cont_in = 0
  for (let x = 0; x <= structure.ports.length-1; ++x){
    if (structure.ports[x]['direction']== inout) {
      str_in[name][cont_in] = '   ' + structure.ports[x]['name'] + ' ';
      str_in[kind][cont_in] = '   ' + structure.ports[x]['type'] + ' ';
      cont_in++;
    }
  }

  return str_in
}

function maxString(generics, inPorts,outPorts,data){
  var max=2
  for (let i = 0; i < generics[data].length; i++) {
    max=Math.max(max, generics[data][i].length)
  }
  max=max/1.5
  for (let i = 0; i < inPorts[data].length; i++) {
    max=Math.max(max, inPorts[data][i].length)
  }
  for (let i = 0; i < outPorts[data].length; i++) {
    max=Math.max(max, outPorts[data][i].length)
  }
  return max
}

//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  diagramGenerator : diagramGenerator
}
