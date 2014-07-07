describe("prop-search", function () {
  var ps = require('../index');
  assert = require('assert');

  var testObj = {
    propA: 'something',
    propB: 'something2',
    propC: { index: true },

    propD: {
      something: true,
      someOther: {
        index: true
      },
      somethingElse: 'somethingElse',
      more: {
        stuff: 'here',
        things: {
          nested: false,
          something: true
        }
      }
    },

    propF: {
      objA: 'Budha',
      someOther: {
        cover: 'something',
        foo: {index: true},
        bar: false,
        something: true
      },
      objC: ['index', 'blah'],
      moreNester: {
        meant: 'tre',
        asdf: {
          someval: true,
          val1: 'good'
        }
      }
    }

  };

  var testObj2 = {
    something: {
      something: {
        something: {
          something: {
            something: true
          }
        }
      }
    }
  };

  var testObj3 = {
    something: {
      otherthing: {
        something: [
          {
            something: true
          },
          {
            other: false
          }
        ]
      }
    }
  };

  var testObj4 = {
    something: {
      other: {
        something: [ 'val1', 'val2', 'val3' ]
      }
    }
  };

  describe("searchForBoolean", function () {
    it("should find boolean values when just given the property name", function () {
      var res = ps.searchForBoolean(testObj, 'index');

      var expected = [
        { path: [ 'propC' ], value: { index: true }, key: 'propC' },
        { path: [ 'propD', 'someOther' ],
          value: { index: true },
          key: 'someOther' },
        { path: [ 'propF', 'someOther', 'foo' ],
          value: { index: true },
          key: 'foo' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work on nested object with all the same named properties', function () {
      var res = ps.searchForBoolean(testObj2, 'something');
      var expected = [
        { path: [ 'something', 'something', 'something', 'something' ],
          value: { something: true },
          key: 'something' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with options set', function () {
      var res = ps.searchForBoolean(testObj, 'someval', {separator: '.'});

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with no options set but val set', function () {
      var res = ps.searchForBoolean(testObj, 'nested', false);

      var expected = [
        { path: [ 'propD', 'more', 'things' ],
          value: { nested: false, something: true },
          key: 'things' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with all options set', function () {
      var res = ps.searchForBoolean(testObj, 'nested', {separator: '.'}, false);

      var expected = [
        { path: 'propD.more.things',
          value: { nested: false, something: true },
          key: 'things' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with arrays', function () {
      var res = ps.searchForBoolean(testObj3, 'something');

      var expected = [
        { path: [ 'something', 'otherthing', 'something' ],
          value: [
            { something: true },
            { other: false }
          ],
          key: 'something' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });
  });

  describe("searchForExistence", function () {
    it('should work with no options set', function () {
      var actual = ps.searchForExistence(testObj, 'someval');

      var expected = [
        { path: [ 'propF', 'moreNester', 'asdf' ],
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work on nested object with all the same named properties', function () {
      var actual = ps.searchForExistence(testObj2, 'something');

      var expected = [
        { path: [], value: { something: {
          something: {
            something: {
              something: {
                something: true
              }
            }
          }
        } }, key: undefined },
        { path: [ 'something' ],
          value: { something: {
            something: {
              something: {
                something: true
              }
            }
          } },
          key: 'something' },
        { path: [ 'something', 'something' ],
          value: { something: {
            something: {
              something: true
            }
          } },
          key: 'something' },
        { path: [ 'something', 'something', 'something' ],
          value: { something: {
            something: true
          } },
          key: 'something' },
        { path: [ 'something', 'something', 'something', 'something' ],
          value: { something: true },
          key: 'something' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {
      var actual = ps.searchForExistence(testObj, 'someval', {separator: '.'});

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with arrays', function () {
      var res = ps.searchForExistence(testObj3, 'other');

      var expected = [
        { path: [ 'something', 'otherthing', 'something' ],
          value: [
            { something: true },
            { other: false }
          ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });
  });

  describe("searchForText", function () {
    it('should work with no option set', function () {
      var expected = [
        { path: [ 'propF', 'moreNester' ],
          value: { meant: 'tre', asdf: {
            someval: true,
            val1: 'good'
          } },
          key: 'moreNester' }
      ];

      var actual = ps.searchForText(testObj, 'tre');

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {
      var expected = [
        { path: 'propD.more',
          value: { stuff: 'here', things: {
            nested: false,
            something: true
          } },
          key: 'more' }
      ];

      var actual = ps.searchForText(testObj, 'here', {separator: '.' });

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with arrays', function () {
      var res = ps.searchForText(testObj4, 'val2');

      var expected = [
        { path: [ 'something', 'other', 'something' ],
          value: [ 'val1', 'val2', 'val3' ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });
  });

  describe("search", function () {
    it('should work with no option set', function () {

      var expected = [
        { path: ['propF', 'moreNester', 'asdf'],
          value: { someval: true,
            val1: 'good' },
          key: 'asdf' }
      ];

      var test = function (obj) {
        return obj.val1 === 'good';
      };

      var actual = ps.search(testObj, test);

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true,
            val1: 'good' },
          key: 'asdf' }
      ];

      var test = function (obj) {
        return obj.val1 === 'good';
      };

      var actual = ps.search(testObj, test, {separator: '.' });

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

  });
});