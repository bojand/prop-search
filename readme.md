# prop-search

Simple property searches on your JavaScript objects.

## Installation

`npm install prop-search`

## Usage overview

Helper module to search an object for properties and conditions, and returns the array of results.
We can search for specific boolean values by key and optionally value. We can search for existence of keys, or perform
a text search, and find results with the text value. Finally we can search using a test function.
All functions returns an array of result objects, which have the format:

```js
{
  path: {Array},   // path to the result. ex. ['keys', 'to', 'result']
  value: {*},      // value of the result ex. { lookup : true }
  key: {String}    // The key where result can be found
}
```

Optionally we can do `join` on the `path` array by passing options with a `separator` options specified.

```js
var ps = require('prop-search');

var someObj = {
  someProp = {
    lookup: true
  }
};

var res = ps.searchForBoolean(someObj, 'lookup');

console.dir(res);
```

Output:

```
[ {
  path: ['someObj', 'someProp'],
  value: { lookup: true },
  key: 'someProp'
}]
```

## API

#### searchForBoolean(obj, query, options, value)

Searches for boolean values.

* `obj`     - The object to search
* `query`   - The key(s) of properties to test for the value. It can be a string or an array of strings.
* `options` - Optionally specify the `separator` string to be used to do `join` on the `path` in the results.
* `value`   - Optionally specify what to match against, `true` or `false`. Default it `true`.

```js
var obj = {
  prop: {
    nested: {
      stuff: {
        something: {
          something: false
        }
      }
    }
  }
};

var res = ps.searchForBoolean(obj, 'something', { separator: '.' }, false);
```
`res`:
```js
[{
  path: 'prop.nested.stuff.something',
  value: { something: true },
  key: 'something' }
}]
```

#### searchForExistence(obj, query, options)

Searches for keys if they exist in the object.

* `obj`     - The object to search
* `query`   - The key(s) of properties to test for existence. It can be a string or an array of strings.
* `options` - Optionally specify the `separator` string to be used to do `join` on the `path` in the results.

```js
var obj = {
  prop: {
    nested: {
      stuff: {
        something: {
          other: 'blah'
        }
      }
    }
  }
};

var res = ps.searchForExistence(obj, 'other');
```
`res`:
```js
[ { path: [ 'prop', 'nested', 'stuff', 'something' ],
    value: { other: 'blah' },
    key: 'something' } ]
```

#### searchForText(obj, query, options)

Searches for text if they exist in the object.

* `obj`     - The object to search
* `query`   - The text string(s) to search in the object. It can be a string or an array of strings.
* `options` - Optionally specify the `separator` string to be used to do `join` on the `path` in the results.

```js
var obj = {
  prop: {
    nested: {
      stuff: {
        something: {
          other: 'blah'
        }
      }
    }
  }
};

var res = ps.searchForText(obj, 'blah');
```
`res`:
```js
[ { path: [ 'prop', 'nested', 'stuff', 'something' ],
    value: { other: 'blah' },
    key: 'something' } ]
```

#### search(obj, test, options)

Searches the object using the `test` function. `test` iterator function accepts a parameter `obj` which is an object
as the search object is iterated. Test the object for whatever condition. The function has to return `true` or `false`.

* `obj`     - The object to search
* `test`    - The iterator test function.
* `options` - Optionally specify the `separator` string to be used to do `join` on the `path` in the results.

```js
var obj = {
  prop: {
    nested: {
      stuff: {
        something: {
          other: 'blah'
        }
      }
    }
  }
};

var tester = function (testObj) {
  return testObj.other === 'blah';
};

var res = ps.searchForText(obj, tester, {separator: '.'});
```
`res`:
```js
[ { path: 'prop.nested.stuff.something',
    value: { other: 'blah' },
    key: 'something' } ]
```

## License

MIT