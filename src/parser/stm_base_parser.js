function search_multiple_in_tree(element, matchingTitle) {
  var arr_match = [];
  function recursive_searchTree(element, matchingTitle) {
    let type = element.type;
    if (type === matchingTitle) {
      arr_match.push(element);
    } else if (element !== null) {
      var i;
      var result = null;
      for (i = 0; result === null && i < element.childCount; i++) {
        result = recursive_searchTree(element.child(i), matchingTitle);
      }
      return result;
    }
    return null;
  }
  recursive_searchTree(element, matchingTitle);
  return arr_match;
}

function get_item_multiple_from_childs(p, type) {
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

function get_item_from_childs(p, type) {
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

module.exports = {
  get_item_from_childs: get_item_from_childs,
  get_item_multiple_from_childs: get_item_multiple_from_childs,
  search_multiple_in_tree: search_multiple_in_tree
};