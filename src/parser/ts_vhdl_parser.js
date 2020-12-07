const path = require('path');

class Parser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }

  async init() {
    this.code = '';
    const Parser = require('web-tree-sitter');
    await Parser.init();
    this.parser = new Parser();
    let wasm_file_path = `${path.sep}parsers${path.sep}tree-sitter-verilog.wasm`;
    let Lang = await
      Parser.Language.load(path.join(__dirname, path.sep + "parsers" + path.sep + "tree-sitter-vhdl.wasm"));
    this.parser.setLanguage(Lang);
  }

  parse(code) {
    if (this.code !== code) {
      this.tree = this.parser.parse(code);
      this.code = code;
    }
    return this.tree;
  }

  get_all(code) {
    let elements = {
      'body': this.get_architecture_body_elements(code),
      'declarations': this.get_architecture_declaration_elements(code)
    };
    return elements;
  }

  get_architecture_body(code) {
    let tree = this.parse(code);

    let break_p = false;
    let counter = 0;
    let arch_body = undefined;
    let cursor = tree.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'design_unit') {
        counter += 1;
        if (counter === 2) {
          cursor.gotoFirstChild();
          do {
            if (cursor.nodeType === 'architecture_body') {
              cursor.gotoFirstChild();
              do {
                if (cursor.nodeType === 'concurrent_statement_part') {
                  arch_body = cursor.currentNode();
                  break_p = true;
                }
              }
              while (cursor.gotoNextSibling() === true && break_p === false);
            }
          }
          while (cursor.gotoNextSibling() === true && break_p === false);
        }
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return arch_body;
  }


  get_architecture_body_elements(code) {
    let arch_body = this.get_architecture_body(code);

    let comment_symbol = this.comment_symbol;
    if (comment_symbol === '') {
      comment_symbol = ' ';
    }
    let process_array = [];
    let instanciation_array = [];

    let cursor = arch_body.walk();
    let comments = '';

    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'component_instantiation_statement') {
        let elements = this.get_instantiation(cursor.currentNode());
        for (let i = 0; i < elements.length; ++i) {
          elements[i].description = comments;
          instanciation_array.push(elements[i]);
        }
        comments = '';
      }
      else if (cursor.nodeType === 'simple_waveform_assignment') {
        // let elements = this.get_signal_declaration(cursor.currentNode());
        // for (let i = 0; i < elements.length; ++i) {
        //   elements[i].description = comments;
        //   signal_array.push(elements[i])
        // }
        // comments = '';
      }
      else if (cursor.nodeType === 'process_statement') {
        let elements = this.get_process(cursor.currentNode());
        for (let i = 0; i < elements.length; ++i) {
          elements[i].description = comments;
          process_array.push(elements[i]);
        }
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let txt_comment = cursor.nodeText.slice(2);
        if (txt_comment[0] === comment_symbol) {
          comments += txt_comment.slice(1).trim() + '\n';
        }
      }
      else {
        comments = '';
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return { 'processes': process_array, 'instantiations': instanciation_array };
  }

  get_process(p) {
    let elements = [];
    let name = '';
    let element = {
      'name': ''
    };
    let break_p = false;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'label') {
        name = cursor.nodeText.replace(':', '').trim();
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    if (name === '') {
      element.name = 'unnamed';
    }
    else {
      element.name = name;
    }
    elements.push(element);
    return elements;
  }

  get_instantiation(p) {
    let elements = [];
    let name = '';
    let element = {
      'name': '',
      'type': ''
    };
    let break_p = false;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'label') {
        name = cursor.nodeText.replace(':', '').trim();
      }
      else if (cursor.nodeType === 'component_instantiation') {
        element.type = cursor.nodeText;
      }
      else if (cursor.nodeType === 'entity_instantiation') {
        const regex = /entity+[ \t]/gi;
        element.type = cursor.nodeText.replace(regex, '');
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    if (name === '') {
      element.name = 'unnamed';
    }
    else {
      element.name = name;
    }
    elements.push(element);
    return elements;
  }


  get_architecture_declaration(code) {
    let tree = this.parse(code);

    let break_p = false;
    let counter = 0;
    let arch_declaration = undefined;
    let cursor = tree.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'design_unit') {
        counter += 1;
        if (counter === 2) {
          cursor.gotoFirstChild();
          do {
            if (cursor.nodeType === 'architecture_body') {
              cursor.gotoFirstChild();
              do {
                if (cursor.nodeType === 'declarative_part') {
                  arch_declaration = cursor.currentNode();
                  break_p = true;
                }
              }
              while (cursor.gotoNextSibling() === true && break_p === false);
            }
          }
          while (cursor.gotoNextSibling() === true && break_p === false);
        }
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return arch_declaration;
  }

  get_architecture_declaration_elements(code) {
    let arch_declaration = this.get_architecture_declaration(code);

    let comment_symbol = this.comment_symbol;
    if (comment_symbol === '') {
      comment_symbol = ' ';
    }
    let types_array = [];
    let signals_array = [];
    let constants_array = [];

    let cursor = arch_declaration.walk();
    let comments = '';

    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'full_type_declaration') {
        let elements = this.get_full_type_declaration(cursor.currentNode());
        for (let i = 0; i < elements.length; ++i) {
          elements[i].description = comments;
          types_array.push(elements[i]);
        }
        comments = '';
      }
      else if (cursor.nodeType === 'signal_declaration') {
        let elements = this.get_signal_declaration(cursor.currentNode());
        for (let i = 0; i < elements.length; ++i) {
          elements[i].description = comments;
          signals_array.push(elements[i]);
        }
        comments = '';
      }
      else if (cursor.nodeType === 'constant_declaration') {
        let elements = this.get_constant_declaration(cursor.currentNode());
        for (let i = 0; i < elements.length; ++i) {
          elements[i].description = comments;
          constants_array.push(elements[i]);
        }
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let txt_comment = cursor.nodeText.slice(2);
        let comment_line = cursor.startPosition.row;
        if (txt_comment[0] === comment_symbol) {
          let check = false;
          //Types
          for (let i = 0; i < types_array.length; ++i) {
            if (comment_line === types_array[i].line) {
              types_array[i].description = txt_comment.slice(1).trim() + '\n';
              check = true;
            }
          }
          //Signals
          for (let i = 0; i < signals_array.length; ++i) {
            if (comment_line === signals_array[i].line) {
              signals_array[i].description = txt_comment.slice(1).trim() + '\n';
              check = true;
            }
          }
          //Constants
          for (let i = 0; i < constants_array.length; ++i) {
            if (comment_line === constants_array[i].line) {
              constants_array[i].description = txt_comment.slice(1).trim() + '\n';
              check = true;
            }
          }
          if (check === false) {
            comments += txt_comment.slice(1).trim() + '\n';
          }
        }
      }
      else {
        comments = '';
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return { 'types': types_array, 'signals': signals_array, 'constants': constants_array };
  }

  get_full_type_declaration(p) {
    let elements = [];
    let element = {
      'name': '',
      'type': '',
      'line': 0
    };
    let break_p = false;
    let cursor = p.walk();
    element.line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'identifier') {
        element.name = cursor.nodeText;
      }
      else if (cursor.nodeType === 'enumeration_type_definition') {
        element.type = cursor.nodeText;
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    elements.push(element);
    return elements;
  }

  get_signal_declaration(p) {
    let elements = [];
    let element = {
      'name': '',
      'type': '',
      'line': 0
    };
    let break_p = false;
    let cursor = p.walk();
    element.line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'identifier_list') {
        element.name = cursor.nodeText;
      }
      else if (cursor.nodeType === 'subtype_indication') {
        element.type = cursor.nodeText;
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    elements.push(element);
    return elements;
  }

  get_constant_declaration(p) {
    let elements = [];
    let element = {
      'name': '',
      'type': '',
      'default_value': '',
      'line': 0
    };
    let break_p = false;
    let cursor = p.walk();
    element.line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'identifier_list') {
        element.name = cursor.nodeText;
      }
      else if (cursor.nodeType === 'subtype_indication') {
        element.type = cursor.nodeText;
      }
      else if (cursor.nodeType === 'default_expression') {
        let normalized_value = cursor.nodeText;
        normalized_value = normalized_value.replace(':=', '');
        normalized_value = normalized_value.replace(': =', '');
        element.default_value = normalized_value.trim();
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    elements.push(element);
    return elements;
  }

}

module.exports = {
  Parser: Parser
};