const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

var input = fs.readFileSync(path.resolve(__dirname, 'test.vhd')).toString('utf8');
var output = Colibri.Beautifuler.beauty(input);

console.log(output);
