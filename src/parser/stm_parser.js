const stm_vhdl = require('./vhdl_sm');
const stm_verilog = require('./verilog_sm');
const General = require('../general/general');

async function get_svg_sm(language, code, comment_symbol) {
  if (language === General.LANGUAGES.VHDL) {
    let parser = new stm_vhdl.Paser_stm_vhdl(comment_symbol);
    let stm = await parser.get_svg_sm(code);
    return await stm;
  }
  else if (language === General.LANGUAGES.VERILOG || language === General.LANGUAGES.SYSTEMVERILOG) {
    let parser = new stm_verilog.Paser_stm_verilog(comment_symbol);
    await parser.init();
    let stm = await parser.get_svg_sm(code);
    return await stm;
  }
}

module.exports = {
  get_svg_sm: get_svg_sm
};
