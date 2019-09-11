class runpy {
  constructor(estructure){
    this.str     = estructure;
    this.str_out = "";
  }
  generate(){
    this.header();
    return this.str_out;
  }

  header(){
    this.str_out = "# -*- coding: utf-8 -*-\n"
  }
}


module.exports = {
  runpy : runpy
}
