function parse_author(dic, desc_root){
    const regex_followed = /^\s*[@\\]author\s.*\n\n/gms;
    const regex_not_followed = /^\s*[@\\]author\s.*/gms;
    const regex_replace = /^\s*[@\\]author\s/;
    parse_doxygen(regex_followed, regex_not_followed, regex_replace, 'author', dic, desc_root);
}

function parse_version(dic, desc_root){
  const regex_followed = /^\s*[@\\]version\s.*\n\n/gms;
  const regex_not_followed = /^\s*[@\\]version\s.*/gms;
  const regex_replace = /^\s*[@\\]version\s/;
  parse_doxygen(regex_followed, regex_not_followed, regex_replace, 'version', dic, desc_root);
}

function parse_project(dic, desc_root){
  const regex_followed = /^\s*[@\\]project\s.*\n\n/gms;
  const regex_not_followed = /^\s*[@\\]project\s.*/gms;
  const regex_replace = /^\s*[@\\]project\s/;
  parse_doxygen(regex_followed, regex_not_followed, regex_replace, 'project', dic, desc_root);
}

function parse_copyright(dic, desc_root){
  const regex_followed = /^\s*[@\\]copyright\s.*\n\n/gms;
  const regex_not_followed = /^\s*[@\\]copyright\s.*/gms;
  const regex_replace = /^\s*[@\\]copyright\s/;
  parse_doxygen(regex_followed, regex_not_followed, regex_replace, 'copyright', dic, desc_root);
}

function parse_doxygen(regex_followed, regex_not_followed, regex_replace, name, dic, desc_root){
    // look for copyrights regex, it can be followed by another description or not
    const copyright_regex_followed = regex_followed;
    const copyright_regex_not_followed = regex_not_followed;

    let copyright = desc_root.description.match(copyright_regex_followed);
    if (copyright === null) {
      copyright = desc_root.description.match(copyright_regex_not_followed);
    }
    if (copyright !== null) {
      let stripped_copyright = copyright[0].split(/\n[\s]*\n/gm);
      for (let index = 0; index < stripped_copyright.length; index++) {
        if (stripped_copyright[index] !== undefined && stripped_copyright[index].match(copyright_regex_not_followed) !== null) {
          dic.info[name] = stripped_copyright[index].replace(regex_replace, "");
          desc_root.description = desc_root.description.replace(stripped_copyright[index], "");
        }
      }
    }
}

module.exports = {
  parse_copyright: parse_copyright,
  parse_project: parse_project,
  parse_author: parse_author,
  parse_version: parse_version
};
