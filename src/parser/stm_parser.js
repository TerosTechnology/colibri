const Stm_vhdl = require('./vhdl_sm');
const General = require('../general/general');

async function get_svg_sm(language, code, comment_symbol) {
  if (language === General.LANGUAGES.VHDL) {
    return await Stm_vhdl.get_svg_sm(code, comment_symbol);
  }
}

module.exports = {
  get_svg_sm: get_svg_sm
};
