module.exports = deep_check;

function deep_check(m, n, name, file,exclude) {
  // if both undefined it's true
  if (m === undefined && n === undefined) {
    return true;
  }// check if bot null
  else if (m === null && n === null) {
    return true;
  }
  // check type
  else if (typeof (m) !== typeof (n)) {
    console.log("*************************************************************");
    console.log("Fail: " + name.yellow + " in file: " + file.red);
    console.log(("Comparing the element " + name + " resulted in different types").yellow)
    console.log("Real Type ----->".yellow);
    console.log(typeof (m));
    console.log("Expected Type ----->".yellow);
    console.log(typeof (n));
    console.log("*************************************************************");
    return false;
  }// anything but array or object
  else if (typeof (m) !== "object" && typeof (m) !== "string") {
    if (m !== n) {
      console.log("*************************************************************");
      console.log("Fail: " + name.yellow + " in file: " + file.red);
      console.log(("Comparing the element " + name + " resulted in different values").yellow)
      console.log("Real Value ----->".yellow);
      console.log(m);
      console.log("Expected Value ----->".yellow);
      console.log(n);
      console.log("*************************************************************");
      return false;
    } else {
      return true;
    }
  }// string check
  else if (typeof (m) === "string") {
    let name_m;
    let name_n;
    name_m = m.toLowerCase().replace(/\s/g, '').replace(/\t/g, '');
    name_n = n.toLowerCase().replace(/\s/g, '').replace(/\t/g, '');
    if (name_m !== name_n) {
      console.log("*********************************************************");
      console.log("Fail: " + name.yellow + " in file: " + file.red);
      console.log(("Comparing the strings " + name + " resulted in different values").yellow)
      console.log("Real ----->".yellow);
      console.log(m.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
      console.log("Expected ----->".yellow);
      console.log(n.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
      console.log("*********************************************************");
      return false;
    } else {
      return true;
    }
  } else if (typeof (m) === "object") {
    // check if have the same constructor
    if (m.constructor !== n.constructor) {
      console.log("*************************************************************");
      console.log("Fail: " + name.yellow + " in file: " + file.red);
      console.log("Object  " + name + " type dose not match !, one is Array and the other is object".yellow)
      console.log("Real length ----->".yellow);
      console.log(m.constructor);
      console.log("Expected length ----->".yellow);
      console.log(n.constructor);
      console.log("*************************************************************");
      return false;
    } else {
      if (m.constructor === Array) {
        // array check
        // check array length
        if (m.length !== n.length) {
          console.log("*************************************************************");
          console.log("Fail: " + name.yellow + " in file: " + file.red);
          console.log("Array " + name + " length dose not match !".yellow)
          console.log("Real length ----->".yellow);
          console.log(m.length);
          console.log("Expected length ----->".yellow);
          console.log(n.length);
          console.log("*************************************************************");
          return false;
        }
        // test each element of array
        for (let i = 0; i < m.length; ++i) {
          let element_check = deep_check(m[i], n[i], name + "[" + i + "]", file,exclude);
          if (!element_check) {
            return false;
          }
        }
        return true;
      }
      else {
        // object check
        let m_keys = Object.keys(m);
        let n_keys = Object.keys(n);
        if (m_keys.length == 0 && n_keys.length == 0){
          return true;
        } else{
          for (let i = 0; i < m_keys.length; i++) {
            const key = m_keys[i];
            // exclude the line number from check
            if (!exclude.includes(key)){
              if (n[key] === undefined){
                console.log("*********************************************************");
                console.log("Fail: " + name.yellow + " in file: " + file.red);
                console.log("In object "+ name + " key "+key+" is not found");
                console.log("Real ----->".yellow);
                console.log(m);
                console.log("Expected ----->".yellow);
                console.log(n);
                console.log("*********************************************************");
                return false;
              }else{
                let element_check = deep_check(m[key],n[key],name+"."+key,file,exclude);
                if (!element_check){
                  return false;
                }
              }
            }
          }
          for (let i = 0; i < n_keys.length; i++) {
            const key = n_keys[i];
            if (m[key] === undefined){
              console.log("*********************************************************");
              console.log("Fail: " + name.yellow + " in file: " + file.red);
              console.log("In object "+ name + " key "+key+" is not found");
              console.log("Real ----->".yellow);
              console.log(m);
              console.log("Expected ----->".yellow);
              console.log(n);
              console.log("*********************************************************");
              return false;
            }
          }
          return true;
        }
      }
    }
  }
}