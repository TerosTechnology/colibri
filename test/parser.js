const fs = require('fs');
const Colibri = require('../src/main');
const general = require('../src/general/general')
const General = Colibri.General;
const Parser = Colibri.Parser;
// const VhdlParser = require('../src/parser/vhdlparser')


for (let x=0;x<8;++x){
  var ParserLang = [General.LANGUAGES.VERILOG];
  let parser = new Parser.ParserFactory;
  parser = parser.getParser(ParserLang);
  let example_verilog = fs.readFileSync('./examples/verilog/example_'+x+'.v' ,'utf8');
  let example_result  = parser.getAll(example_verilog);
  let example_exp_result = fs.readFileSync('./examples/verilog/example_'+x+'.json','utf8');
  example_exp_result     = JSON.parse(example_exp_result);
  // console.log(example_result);

  let rs = compareVerilogTs(example_result,example_exp_result,"example_"+x+".v");
  console.log("Test " + rs + " ["+"example_"+x+".v"+"]");
}
////////////////////////////////////////////////////////////////////////////////
// for (let x=0;x<6;++x){
//   var ParserLang = [General.LANGUAGES.VHDL];
//   let parser = new Parser.ParserFactory;
//   parser = parser.getParser(ParserLang);
//   let example_vhd = fs.readFileSync('./examples/vhdl/example_'+x+'.vhd' ,'utf8');
//   let example_result  = parser.getAll(example_vhd);
//   let example_exp_result = fs.readFileSync('./examples/vhdl/example_'+x+'.json','utf8');
//   example_exp_result     = JSON.parse(example_exp_result);
//
//   let rs = compareVhdl(example_result,example_exp_result,"example_"+x+".vhd");
//   console.log("Test " + rs + " ["+"example_"+x+".vhd"+"]")
// }
////////////////////////////////////////////////////////////////////////////////
function compareVhdl(m,n,file){
  var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  if(m['architecture']['name'] != n['architecture']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','kind'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','kind','type'],"ports",file);
  var ch3 = check(m['signals'],n['signals'],['name','kind'],"signals",file);
  var ch4 = check(m['constants'],n['constants'],['name','kind'],"constants",file);
  var ch5 = check(m['types'],n['types'],['name','kind'],"types",file);
  var ch6 = check(m['process'],n['process'],['name'],"process",file);

  return ch0 && ch1 && ch2 && ch3 && ch4 && ch5 && ch6;
}
function compareVerilog(m,n,file){
  var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','kind'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','kind','type'],"ports",file);
  var ch3 = check(m['regs'],n['regs'],['name','kind','type'],"regs",file);
  var ch4 = check(m['nets'],n['nets'],['name','kind','type'],"nets",file);
  var ch5 = check(m['constants'],n['constants'],['name','kind'],"constants",file);

  return ch0 && ch1 && ch2 && ch3 && ch4 && ch5;
}
function compareVerilogTs(m,n,file){
  // var ch0 = check(m['libraries'],n['libraries'],['name'],"libraries",file);
  if(m['entity']['name'] != n['entity']['name']) { return false; }
  var ch1 = check(m['generics'],n['generics'],['name','kind'],"generics",file);
  var ch2 = check(m['ports'],n['ports'],['name','direction','type','comment'],"ports",file);
  // var ch3 = check(m['regs'],n['regs'],['name','kind','type'],"regs",file);
  // var ch4 = check(m['nets'],n['nets'],['name','kind','type'],"nets",file);
  // var ch5 = check(m['constants'],n['constants'],['name','kind'],"constants",file);

  return ch1 && ch2;
}

function check(m,n,cmp,type,file){
  if(m.length != n.length) {
    console.log("*************************************************************")
    console.log("Fail: " + type + " in file: " + file);
    console.log("Real ----->");
    console.log(m);
    console.log("Expected ----->");
    console.log(n);
    console.log("*************************************************************")
    return false;
  }
  for (let i=0;i<m.length;++i) {
    for (let z=0;z<cmp.length;++z){
      // console.log(m[i]['name'])
      // console.log(file)
      // console.log(type)
      // console.log(cmp[z])

      let name_m;
      let name_n;
      if(m[i][cmp[z]] == undefined){
        name_m = "";
      }
      else{
        name_m = m[i][cmp[z]].toLowerCase().replace(/\s/g,'').replace(/\t/g,'');
      }
      name_n = n[i][cmp[z]].toLowerCase().replace(/\s/g,'').replace(/\t/g,'');

      if(name_m != name_n) {
        console.log("*********************************************************")
        console.log(JSON.stringify(name_m));
        console.log(JSON.stringify(name_n));
        console.log("Fail: " + type + " in file: " + file);
        console.log("Real ----->");
        console.log(m);
        console.log("Expected ----->");
        console.log(n);
        console.log("*********************************************************")
        return false;
      }
    }
  }
  return true;
}
