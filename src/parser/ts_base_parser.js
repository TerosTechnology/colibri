class Ts_base_parser {

  search_multiple_in_tree(element, matching_title) {
    var arr_match = [];
    function recursive_searchTree(element, matching_title) {
      let type = element.type;
      if (type === matching_title) {
        arr_match.push(element);
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matching_title);
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matching_title);
    return arr_match;
  }

  search_in_tree(element, matching_title) {
    var match = undefined;
    function recursive_searchTree(element, matching_title) {
      let type = element.type;
      if (type === matching_title) {
        match = element;
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matching_title);
          if (result !== null) {
            break;
          }
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matching_title);
    return match;
  }

  get_item_multiple_from_childs(p, type) {
    if (p === undefined) {
      return [];
    }
    let items = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === type) {
        let item = cursor.currentNode();
        items.push(item);
      }
    }
    while (cursor.gotoNextSibling() === true);
    return items;
  }

  get_item_from_childs(p, type) {
    if (p === undefined) {
      return undefined;
    }
    let item = undefined;
    let cursor = p.walk();
    let break_p = false;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === type) {
        item = cursor.currentNode();
        break_p = true;
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return item;
  }
}

module.exports = {
  Ts_base_parser: Ts_base_parser
};