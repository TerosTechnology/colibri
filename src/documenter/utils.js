const json5 = require('json5');

function remove_description_spaces(description){
  let description_split = description.split(/\r?\n/);
  let description_trail = '';
  for (let i = 0; i < description_split.length; i++) {
    const element = description_split[i];
    description_trail += element.trim() + '\n';
  }
  return description_trail;
}

function remove_description_first_space(description){
  let description_split = description.split(/\r?\n/);
  let description_trail = '';
  for (let i = 0; i < description_split.length; i++) {
    const element = description_split[i];
    if (element[0] === ' '){
      description_trail += element.substring(1) + '\n';
    }
    else{
      description_trail += element + '\n';
    }
  }
  return description_trail;
}

function get_wavedrom_svg(text) {
  //Search json candidates
  let json_candidates = get_json_candidates(text);
  let svg_diagrams = [];
  let text_modified = text;

  let wavedrom = require('wavedrom');
  var render = require('bit-field/lib/render');
  let onml = require('onml');

  let counter = 0;
  for (let i = 0; i < json_candidates.length; ++i) {
    try {
      let json = json5.parse(json_candidates[i]);
      let diagram = wavedrom.renderAny(0, json, wavedrom.waveSkin);
      let diagram_svg = onml.s(diagram);
      svg_diagrams.push(diagram_svg);
      text_modified = text_modified.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
      ++counter;
    }
    catch (error) {
      try {
        let json = json5.parse(json_candidates[i]);
        let options = {
          hspace: 888
        };
        let jsonml = render(json, options);
        let diagram_svg = onml.stringify(jsonml);

        svg_diagrams.push(diagram_svg);
        text_modified = text_modified.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
        ++counter;
      }
      // eslint-disable-next-line no-console
      catch (error) { console.log(""); }
    }

  }
  return { description: text_modified, wavedrom: svg_diagrams };
}

function get_json_candidates(text) {
  let json = [];
  let i = 0;
  let brackets = 0;
  let character_number_begin = 0;
  while (i < text.length) {
    if (text[i] === '{') {
      character_number_begin = i;
      ++brackets;
      ++i;
      while (i < text.length) {
        if (text[i] === '{') {
          ++brackets;
          ++i;
        }
        else if (text[i] === '}') {
          --brackets;
          if (brackets === 0) {
            json.push(text.slice(character_number_begin, i + 1));
            break;
          }
          ++i;
        }
        else {
          ++i;
        }
      }
    }
    else {
      ++i;
    }
  }
  return json;
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function normalize_description(description){
  let desc_inst = description.replace(/\n\s*\n/g, '<br> ');
  desc_inst = desc_inst.replace(/\n/g, ' ');
  desc_inst = desc_inst.replace(/<br \/>/g,' ');
  return desc_inst;
}

module.exports = {
  remove_description_first_space: remove_description_first_space,
  remove_description_spaces: remove_description_spaces,
  get_wavedrom_svg: get_wavedrom_svg,
  get_json_candidates: get_json_candidates,
  makeid: makeid,
  normalize_description : normalize_description
};
