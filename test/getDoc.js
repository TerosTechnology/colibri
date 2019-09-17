const ln = require('../src/documenter/documenter');
const fs = require('fs');

var generics = [
  {'name' : "generic_0",
   'type' : 'integer' },
  {'name' : "generic_1",
   'type' : 'std_logic' },
  {'name' : "generic_2",
   'type' : 'integer' }
];

var ports = [
  {'name'      : "port_0",
   'direction' : 'in',
   'type'      : 'integer' },
  {'name'      : "port_1",
   'direction' : 'in',
   'type'      : 'std_logic' },
  {'name'      : "port_2",
   'direction' : 'out',
   'type'      : 'std_logic_vector(generic_0 downto 0)' }
];

var structure = fs.readFileSync('./documentation/examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);

var D = new ln.BaseStructure(structure);
var md = D.getMdDoc('./');
D.getPdfDoc('./');
var html = D.getHtmlDoc();
var svg = D.getDiagram();

console.log(md);
