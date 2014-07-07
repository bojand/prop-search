/**
 * Checks whether the input is a plain object
 *
 * @api private
 * @param {Mixed} input
 * @returns {Boolean}
 */
function isPlainObject(input) {
  if (input !== null && typeof input === 'object') return true;
  else return false;
}

/**
 * Recursively performs search on the given object on properties that pass the test function.
 * Test function accepts an object, and must return true or false.
 *
 * @api private
 * @param {Mixed} obj       input
 * @param {Function} test   the test function
 * @param {Array} path      array of the current path
 * @param {Array} ret       current results
 * @returns {Array}
 */
function objectSearch(obj, parent, test, path, ret) {
  if (typeof parent === 'function') {
    test = parent;
    parent = null;
  }

  if (!path) { path = [] }
  if (!ret) ret = [];

  if (test(obj)) {
    var p = path;
    var key = path[path.length - 1];
    var val = obj;

    // in case it's an array
    if (parent && Array.isArray(parent)) {
      val = parent;
    }
    else if (!isPlainObject(obj) && isPlainObject(parent)) {
      // or primitive
      val = parent;
      path.pop();
      key = path[path.length - 1];
    }

    ret.push({
      path: p,
      value: val,
      key: key
    });
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key) && isPlainObject(obj[key])) {
      var curr = obj[key];
      if (Array.isArray(curr)) {
        curr.forEach(function (elem) {
          objectSearch(elem, curr, test, path.concat(key), ret)
        });
      }
      else {
        objectSearch(curr, curr, test, path.concat(key), ret)
      }
    }
  }

  return ret;
}

/**
 * Joins the resulting paths in the result arrays if needed and specified in options.
 *
 * @api private
 * @param res
 * @param options
 */
function joinPaths(res, options) {
  if (res && res.length > 0 && typeof options.separator === 'string') {
    res.forEach(function (elem) {
      elem.path = elem.path.join(options.separator);
    });
  }

  return res;
}

/**
 * Performs search on the given object on properties that pass the test function.
 * Test function accepts an object, and must return true or false.
 *
 * @api public
 * @param {Mixed} obj       input
 * @param {Mixed} options   options
 * @param {Function} test   test function
 * @returns {Array}
 */
exports.search = function (obj, test, options) {
  if (!options) {
    options = {};
  }
  return joinPaths(objectSearch(obj, test), options);
};

/**
 * Searches of boolean properties for the given property key(s)
 *
 * @api public
 * @param {Mixed} obj       input
 * @param {String|Array} query  The property key(s) to check.
 *                              It can be array, then searches for any one of the items in array.
 * @param {Mixed} options   <optional> options
 * @param {Boolean} val     <optional> what boolean value to search for. default is true
 * @returns {Array}
 */
exports.searchForBoolean = function (obj, query, options, val) {
  if (val === undefined && options === undefined) {
    val = true;
    options = {};
  }
  else if (val === undefined && typeof options === 'boolean') {
    val = options;
    options = {};
  }
  else if (val === undefined) {
    val = true;
  }

  var testProp = function (obj, key) {
    if (obj) {
      if (typeof key === 'string') {
        return obj[key] === val;
      }
    }
    return false;
  };

  var test = function test(obj) {
    if (typeof query === 'string') {
      return testProp(obj, query);
    }
    else if (Array.isArray(query)) {
      for (var i = 0; i < query.length; i++) {
        if (testProp(obj, query[i])) return true;
      }
    }

    return false;
  };

  return joinPaths(objectSearch(obj, test), options);
};

/**
 * Searches of existence of properties for the given property key(s)
 *
 * @api public
 * @param {Mixed} obj
 * @param {String|Array} query
 * @param {Mixed} options   <optional> options
 * @returns {Array}
 */
exports.searchForExistence = function (obj, query, options) {
  if (!options) {
    options = {};
  }

  var testProp = function (obj, key) {
    if (typeof key === 'string') {
      if (obj) {
        if (obj[key]) {
          return true;
        }
        else if (typeof obj[key] === 'boolean') {
          return true;
        }
      }
    }
    return false;
  };

  var test = function test(obj) {
    if (typeof query === 'string') {
      return testProp(obj, query);
    }
    else if (Array.isArray(query)) {
      for (var i = 0; i < query.length; i++) {
        if (testProp(obj, query[i])) return true;
      }
    }

    return false;
  };

  return joinPaths(objectSearch(obj, test), options);
};

/**
 * Searches the object for any properties whose value matches the query string.
 * If query is an array, matches any of the strings in the array.
 *
 * @api public
 * @param {Mixed} obj
 * @param {Mixed} options
 * @param {String|Array} query the text to match
 * @returns {Array}
 */
exports.searchForText = function (obj, query, options) {
  if (!options) {
    options = {};
  }

  var testObj = function (obj, query) {
    if (obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        return obj.indexOf(query) >= 0;
      }
      else if (typeof obj === 'string') {
        return obj === query;
      }
      else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            return obj[key] === query;
          }
        }
      }
    }

    return false;
  };

  var test = function test(obj) {
    if (typeof query === 'string') {
      return testObj(obj, query);
    }
    else if (Array.isArray(query)) {
      for (var i = 0; i < query.length; i++) {
        if (testObj(obj, query[i])) return true;
      }
    }

    return false;
  };

  return joinPaths(objectSearch(obj, test), options);
};