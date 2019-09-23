class cocotb {
  constructor(estructure){
    this.str     = estructure;
    this.str_out = "";
    this.path = require('path')
  }
  generate(){
    this.header();
    this.pythonLibraries()
    this.clockGen()
    this.cocoTest()
    return this.str_out;
  }

  header(){
    this.str_out = "# -*- coding: utf-8 -*-\n"
  }
  pythonLibraries(){
    this.str_out += "import cocotb\nfrom cocotb.triggers import Timer\nfrom cocotb.result import TestFailure\nimport random\n"
  }
  clockGen(){
    this.str_out += '\n@cocotb.coroutine\n'
    this.str_out += 'def gen_clk(clk, period):\n'
    this.str_out += '    while True:\n'
    this.str_out += '        clk.value = 0\n'
    this.str_out += '        yield Timer(period/2)\n'
    this.str_out += '        clk.value = 1\n'
    this.str_out += '        yield Timer(period/2)\n'
  }
  cocoTest(){
    this.str_out += '\n@cocotb.test()\n'
    this.str_out += 'def ' + this.str.entity["name"] + '_testAlive(dut):\n'
    this.str_out += '    Period = 10\n'
    let x=0
    while (((this.str.ports[x]["direction"] != "in" && this.str.ports[x]["direction"] != "input") && (this.str.ports[x]["type"] != "std_logic" && this.str.ports[x]["type"] != "")) && x<this.str.ports.length  ) {
      x++;
      if (x==this.str.ports.length) {
        break
      }
    }
    if (x<this.str.ports.length) { // There is a valid input for clok
      this.str_out += '    clk=dut.' + this.str.ports[x]["name"] + '\n'
      this.str_out += '    cocotb.fork(gen_clk(clk, Period))\n'
    }
    this.str_out += '    yield Timer(20*Period)\n'
    for (var i = 0; i < this.str.ports.length-1; i++) {
      if ((this.str.ports[i]["direction"] == "in" || this.str.ports[i]["direction"] == "input") && i !=x) {
        this.str_out += '    '+ this.str.ports[i]["name"]+' = random.randint(0, 1)\n'
      }
    }
    for (var i = 0; i < this.str.ports.length-1; i++) {
      if ((this.str.ports[i]["direction"] == "in" || this.str.ports[i]["direction"] == "input") && i !=x) {
        this.str_out += '    dut.'+ this.str.ports[i]["name"] + ' = ' + this.str.ports[i]["name"] + '\n'
      }
    }
    this.str_out += '    yield Timer(20*Period)\n'
    x = 0
    while (x<this.str.ports.length) {
      if ((this.str.ports[x]["direction"] == "out" || this.str.ports[x]["direction"] == "output")) {
        this.str_out += '    print(dut.'+this.str.ports[x]["name"]+')\n'
      }
      x++;
      if (x==this.str.ports.length) {
        break
      }
    }
    x = 0
    while ((this.str.ports[x]["direction"] != "out" && this.str.ports[x]["direction"] != "output") && x<this.str.ports.length-1) {
      x++;
    }
    this.str_out += '    if int(dut.' + this.str.ports[x]["name"] + ') == int(dut.' + this.str.ports[x]["name"] + '):\n'
    this.str_out += '        raise TestFailure(\n'
    this.str_out += '        "result is incorrect: %s != %s" % str(dut.'+this.str.ports[x]["name"]+'))\n'
    this.str_out += '    else:\n'
    this.str_out += '        dut._log.info("Ok!")\n'
  }
}

module.exports = {
  cocotb : cocotb
}