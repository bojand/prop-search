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
          nested: true,
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

  describe("searchForBoolean", function () {
    it("should find boolean values when just given the property name", function () {
      var ret = ps.searchForBoolean(testObj, 'index');

      assert.equal(ret.length, 3, 'incorrect number of results.');
    });
  });

  describe("searchForExistence", function () {

  });

  describe("searchForText", function () {

  });

  describe("search", function () {

  });
});