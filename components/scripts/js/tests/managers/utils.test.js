/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/utils", function() {
  "use strict";

  var module = unitTests.requestModule("managers/utils");

  beforeEach(function() {
    window.X = {
      classes: unitTests.classes
    };

    module();
  });

  afterEach(function() {
    delete window.X;
    delete window.createjs;
  });

  it("should define X.utils", function() {
    expect(X.utils).toBeDefined();
  });

  it("should implement X.utils.onNextTick", function() {
    // ---- SETUP
    var c,
      tick = function() {
        c();
      };

    window.createjs = {
      Ticker: {
        on: function(a, f) {
          c = f;
        }
      }
    };

    var callback = jasmine.createSpy("callback");

    // ---- Test
    var method = X.utils.onNextTick(callback);
    method("hello");

    expect(callback).not.toHaveBeenCalled();

    tick();

    expect(callback).toHaveBeenCalledWith("hello");
  });

  it("should implement X.utils.singleton", function() {
    var spy = jasmine.createSpy("spy"),
      foobar = X.utils.singleton(spy);

    foobar("parameter");

    expect(spy).toHaveBeenCalledWith("parameter");

    spy.calls.reset();

    foobar();

    expect(spy).not.toHaveBeenCalled();
  });

  it("should implement X.utils.callIfDefined", function() {
    var data = {
      defined: jasmine.createSpy("definedCallback"),
      notDefined: undefined
    };

    // ---- Test 1
    X.utils.callIfDefined(data.defined, 1, 2, 3);
    expect(data.defined).toHaveBeenCalledWith(1, 2, 3);

    // ---- Test 2
    expect(function() {
      X.utils.callIfDefined(data.notDefined, 1, 2, 3);
    }).not.toThrow();

    // ---- Test 3
    expect(
      X.utils.callIfDefined(function(p) {
        return p;
      }, "hello")
    ).toBe("hello");
  });

  it("should implement X.utils.callByType", function() {
    var data = {
      string: function() {
        return "string";
      },
      number: function() {
        return "number";
      },
      object: function() {
        return "object";
      },
      array: function() {
        return "array";
      }
    };

    function test(parameter, r) {
      expect(X.utils.callByType(parameter, data)).toEqual(r);
    }

    test("hello world", "string");
    test(123, "number");
    test({}, "object");
    test([], "array");
  });

  it("should implement X.utils.hasSuffix", function() {
    expect(X.utils.hasSuffix("foo_bar", "_bar")).toBe(true);
    expect(X.utils.hasSuffix("foo_bar", "_boo")).toBe(false);
  });

  it("should implement X.utils.isEmpty", function() {
    expect(X.utils.isEmpty({})).toBe(true);
    expect(X.utils.isEmpty({ key: "value" })).toBe(false);

    expect(X.utils.isEmpty([])).toBe(true);
    expect(X.utils.isEmpty(["value"])).toBe(false);
  });

  describe("tests for X.utils.forEach", function() {
    it("should loop through arrays", function() {
      var calls = [];

      X.utils.forEach([1, 2, 3, 4], function(p) {
        calls.push(p);
      });

      expect(calls).toEqual([1, 2, 3, 4]);
    });

    it("should loop through objects", function() {
      var calls = [];

      X.utils.forEach(
        {
          a: 1,
          b: 2,
          c: 3
        },

        function(key) {
          calls.push(key);
        }
      );

      expect(calls).toEqual(["a", "b", "c"]);
    });
  });

  describe("X.utils.defaultTo()", function() {
    function defaultToEquals(data) {
      var result = X.utils.defaultTo(data.def, data.obj);
      expect(result).toEqual(jasmine.objectContaining(data.result));
    }

    it("should provide single level object defaults", () => {
      // 1: SETUP
      defaultToEquals({
        obj: {
          foo: true
        },
        def: {
          foo: false,
          bar: false
        },
        result: {
          foo: true,
          bar: false
        }
      });

      // 2: TEST

      // 3: ASSERT
    });

    it("should provide multi-level object defaults", () => {
      // 1: SETUP

      defaultToEquals({
        obj: {
          foo: true,
          bar: {
            scooby: true
          }
        },
        def: {
          foo: false,
          bar: {
            scooby: false,
            doo: false
          },
          tzar: {
            humbug: false
          }
        },
        result: {
          foo: true,
          bar: {
            scooby: true,
            doo: false
          },
          tzar: {
            humbug: false
          }
        }
      });

      // 2: TEST

      // 3: ASSERT
    });
  });

  describe("tests for X.utils.filter", function() {
    beforeEach(function() {
      this.test = function(a, fm, r) {
        expect(X.utils.filter(a, fm)).toEqual(r);
      };
    });

    it("should filter arrays", function() {
      this.test(
        [1, 2, 3, 4, 5],

        function(element) {
          return element > 3;
        },

        [4, 5]
      );
    });

    it("should filter objects", function() {
      this.test(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        },

        function(key, value) {
          return key === "c" || value === 4;
        },

        {
          c: 3,
          d: 4
        }
      );
    });

    it("should filter strings", function() {
      this.test(
        "mississippi",

        function(letter) {
          return letter === "s";
        },

        "ssss"
      );
    });
  });

  describe("X.utils.getMissingProps()", () => {
    function test(data) {
      var result = X.utils.getMissingProps(data.props, data.obj);
      expect(result).toEqual(data.result);
    }

    it("should return true if object contains all props", () => {
      // 1: SETUP
      // 2: TEST
      // 3: ASSERT
      test({
        props: ["a", "b", "c"],
        obj: {
          a: true,
          b: true,
          c: true
        },
        result: []
      });
    });

    it("should return the name of a missing prop", () => {
      // 1: SETUP
      // 2: TEST
      // 3: ASSERT

      test({
        props: ["a", "b", "c"],
        obj: {
          a: true,
          c: true
        },
        result: ["b"]
      });
    });
  });

  describe("X.utils.ifElse()", () => {
    function test(data) {
      var trueSpy = jasmine.createSpy("true spy");
      var falseSpy = jasmine.createSpy("false spy");
      var returnedMethod = X.utils.ifElse(data.predicate, trueSpy, falseSpy);
      var returnValue = returnedMethod.apply(null, data.arguments);

      if (data.returnValue) {
        expect(returnValue).toEqual(data.returnValue);
      }

      if (data.methodCalled) {
        expect(trueSpy).toHaveBeenCalled();
        expect(falseSpy).not.toHaveBeenCalled();
      } else {
        expect(trueSpy).not.toHaveBeenCalled();
        expect(falseSpy).toHaveBeenCalled();
      }
    }

    it("should call the true method if predicate returns true", () => {
      // 1: SETUP
      // 2: TEST
      // 3: ASSERT
      test({
        predicate: () => true,
        methodCalled: true,
        arguments: [],
        returnValue: null
      });
    });

    it("should call the false method if predicate returns false", () => {
      // 1: SETUP
      // 2: TEST
      // 3: ASSERT
      test({
        predicate: () => false,
        methodCalled: false,
        arguments: [],
        returnValue: null
      });
    });

    it("should pass along arguments", () => {
      // 1: SETUP
      var predicateSpy = jasmine
        .createSpy("predicate")
        .and.callFake(() => true);
      var trueSpy = jasmine.createSpy("true spy");
      var falseSpy = jasmine.createSpy("false spy");

      // 2: TEST
      X.utils.ifElse(predicateSpy, trueSpy, falseSpy)("foobar");
      // 3: ASSERT
      expect(predicateSpy).toHaveBeenCalledWith("foobar");
      expect(trueSpy).toHaveBeenCalledWith("foobar");
    });

    it("should return the true/false method's return argument", () => {
      // 1: SETUP
      var predicateSpy = jasmine
        .createSpy("predicate")
        .and.callFake(() => true);
      var trueSpy = jasmine.createSpy("true spy").and.callFake(() => "foobar");
      var falseSpy = jasmine.createSpy("false spy");

      // 2: TEST
      var returnValue = X.utils.ifElse(predicateSpy, trueSpy, falseSpy)(
        "foobar"
      );
      // 3: ASSERT
      expect(returnValue).toBe("foobar");
    });
  });

  describe("X.utils.when()", () => {
    it("should call a method when the predicate returns true", () => {
      // 1: SETUP
      var predicateSpy = jasmine
        .createSpy("predicate")
        .and.callFake(() => true);
      var trueSpy = jasmine.createSpy("true spy");

      // 2: TEST
      X.utils.when(predicateSpy, trueSpy)("foobar");

      // 3: ASSERT
      expect(trueSpy).toHaveBeenCalledWith("foobar");
      expect(predicateSpy).toHaveBeenCalledWith("foobar");
    });

    it("should return identity when incorrect", function() {
      // 1: SETUP
      var predicate = () => false;
      var trueSpy = jasmine.createSpy("true spy");

      // 2: TEST
      var result = X.utils.when(predicate, trueSpy)("anything");

      // 3: ASSERT
      expect(trueSpy).not.toHaveBeenCalled();
      expect(result).toBe("anything");
    });
  });

  describe("X.utils.unless()", () => {
    it("should call a method when the predicate returns false", () => {
      // 1: SETUP
      var predicateSpy = jasmine
        .createSpy("predicate")
        .and.callFake(() => false);
      var falseSpy = jasmine.createSpy("false spy");

      // 2: TEST
      X.utils.unless(predicateSpy, falseSpy)("foobar");

      // 3: ASSERT
      expect(falseSpy).toHaveBeenCalledWith("foobar");
      expect(predicateSpy).toHaveBeenCalledWith("foobar");
    });
  });

  describe("X.utils.getPercent()", () => {
    it("should with a max of 100, min of 0, and a value of 50 give us: .5", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.getPercent(0, 100, 50);

      // 3: ASSERT
      expect(result).toBe(0.5);
    });

    it("should with a max of 10 and a min of -10 and a value of -8 give us .1", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.getPercent(-10, 10, -8);

      // 3: ASSERT
      expect(result).toBe(0.1);
    });
  });

  describe("X.utils.minMax()", () => {
    it("should return the number if it is within the range", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.minMax(0, 100, 50);

      // 3: ASSERT
      expect(result).toBe(50);
    });

    it("should return the max number if above", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.minMax(0, 100, 200);

      // 3: ASSERT
      expect(result).toBe(100);
    });

    it("should return the min number if below", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.minMax(0, 100, -100);

      // 3: ASSERT
      expect(result).toBe(0);
    });
  });

  describe("X.utils.calculatePercentInRange()", () => {
    it("should with min of 10 and max of 20 and value of .5 return 15", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.calculatePercentInRange(10, 20, 0.5);

      // 3: ASSERT
      expect(result).toBe(15);
    });

    it("should with min of -10 and max of 10 and value of .25 return -5", () => {
      // 1: SETUP
      // 2: TEST
      var result = X.utils.calculatePercentInRange(-10, 10, 0.25);

      // 3: ASSERT
      expect(result).toBe(-5);
    });
  });

  describe("X.utils.reduce()", function() {
    it("should take a method and send the accumulated value and the current value into the method", function() {
      // 1: SETUP
      var list = ["a", "b", "c"];
      var intialValue = "z";
      var method = function(value, acc) {
        return acc + "_" + value;
      };

      // 2: TEST
      var result = X.utils.reduce(method, intialValue, list);

      // 3: ASSERT
      expect(result).toBe("z_a_b_c");
    });
  });

  describe("X.utils.forEachUntil", function() {
    it("should keep looping through a list until the looping method returns something that matches the predicate", function() {
      // 1: SETUP
      var list = ["F", "B", "I"];

      function predicate(value) {
        return value !== undefined;
      }

      function loop(value) {
        if (value === "B") return value;
      }

      // 2: TEST
      var result = X.utils.forEachUntil(predicate, loop, list);

      // 3: ASSERT
      expect(result).toBe("B");
    });

    it("should work with objects", function() {
      // 1: SETUP
      var list = {
        a: "f",
        b: "b",
        c: "i"
      };

      function predicate(value) {
        return value !== undefined;
      }

      function loop(value) {
        if (value === "b") return value;
      }

      // 2: TEST
      var result = X.utils.forEachUntil(predicate, loop, list);

      // 3: ASSERT
      expect(result).toBe("b");
    });
  });

  describe("X.utils.forEachUntilResult", function() {
    it("should keep looping through a list until the looping method returns something that matches the predicate", function() {
      // 1: SETUP
      var list = ["F", "B", "I"];

      function loop(value) {
        if (value === "B") return value;
      }

      // 2: TEST
      var result = X.utils.forEachUntilResult(loop, list);

      // 3: ASSERT
      expect(result).toBe("B");
    });
  });

  describe("X.utils.within()", function() {
    it("should return true if a number is within two ranges", function() {
      // 2: TEST
      var result = X.utils.within(1, 10, 5);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if number outside two ranges", function() {
      // 2: TEST
      var result = X.utils.within(1, 10, 11);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });

  describe("X.utils.both", function() {
    it("should return true if both the predicates return true", function() {
      // 1: SETUP
      var a = () => true;
      var b = value => value === "foobar";

      var method = X.utils.both(a, b);

      // 2: TEST
      var result1 = method("foobar");
      var result2 = method("something else");

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  });

  describe("X.utils.either", function() {
    it("should return true if either the predicates return true", function() {
      // 1: SETUP
      var a = value => typeof value === "string";
      var b = value => value === "foobar";

      var method = X.utils.either(a, b);

      // 2: TEST
      var result1 = method("foobar");
      var result2 = method("something else");
      var result3 = method(10);

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(false);
    });
  });

  describe("X.utils.curry()", function() {
    function getCurriedAdd() {
      function add(a, b) {
        return a + b;
      }

      return X.utils.curry(2, add);
    }

    it("should call the function directly if all the parameters are passed in on first call", function() {
      // 1: SETUP
      var curriedAdd = getCurriedAdd();

      // 2: TEST
      var result = curriedAdd(1, 2);

      // 3: ASSERT
      expect(result).toBe(3);
    });

    it("should allow us to send in some parameters first and the rest later", function() {
      // 1: SETUP
      var curriedAdd = getCurriedAdd();

      // 2: TEST
      var inc = curriedAdd(1);

      // 3: ASSERT
      expect(inc(10)).toBe(11);
    });

    it("should allow us to add parameters one at a time", function() {
      // 1: SETUP
      function addThree(a, b, c) {
        return a + b + c;
      }

      var curriedAddThree = X.utils.curry(3, addThree);

      // 2: TEST
      var add2 = curriedAddThree(1);
      var add1 = add2(2);
      var result1 = add1(3);

      add1 = curriedAddThree(1, 2);
      var result2 = add1(3);

      var result3 = curriedAddThree(1, 2, 3);

      // 3: ASSERT
      expect(result1).toBe(6);
      expect(result2).toBe(6);
      expect(result3).toBe(6);
    });

    it("should allow us to use X.utils.__ to specify a blank", function() {
      // 1: SETUP
      function subtract(a, b) {
        return a - b;
      }

      var curriedSubtract = X.utils.curry(2, subtract);

      // 2: TEST
      var dec = curriedSubtract(X.utils.__, 1);

      var result = dec(10);

      // 3: ASSERT
      expect(result).toBe(9);
    });
  });

  describe("X.utils.map()", function() {
    it("should opperate a method over each element of an array, saving the returned result", function() {
      // 1: SETUP
      var inc = value => value + 1;

      var data = [1, 2, 3];

      // 2: TEST
      var result = X.utils.map(inc, data);

      // 3: ASSERT
      expect(result).toEqual([2, 3, 4]);
      expect(result).not.toBe(data);
    });

    it("should also work on objects", function() {
      // 1: SETUP
      var inc = value => value + 1;

      var data = {
        a: 1,
        b: 2,
        c: 3
      };

      // 2: TEST
      var result = X.utils.map(inc, data);

      // 3: ASSERT
      expect(result).toEqual(
        jasmine.objectContaining({
          a: 2,
          b: 3,
          c: 4
        })
      );

      expect(result).not.toBe(data);
    });
  });

  describe("X.utils.pipe()", function() {
    it("should call all methods in a row, sending the output of one as input to the next", function() {
      // 1: SETUP
      var inc = value => value + 1;

      // 2: TEST
      var add3 = X.utils.pipe(
        inc,
        inc,
        inc
      );

      // 3: ASSERT
      expect(add3(3)).toBe(6);
    });
  });

  describe("X.utils.complement()", function() {
    it("should change a 'true' result to a 'false' result and visa versa", function() {
      // 1: SETUP
      var obj = { a: true };
      var objCheckFalse = X.utils.propEq("a", false);
      var objCheckTrue = X.utils.complement(objCheckFalse);

      // 2: TEST
      var result1 = objCheckFalse(obj);
      var result2 = objCheckTrue(obj);

      // 3: ASSERT
      expect(result1).toBe(false);
      expect(result2).toBe(true);
    });

    it("should work with multiple arguments", function() {
      // 1: SETUP
      function equals(p1, p2) {
        return p1 === p2;
      }

      var notEquals = X.utils.complement(equals);

      // 2: TEST
      var result1 = equals(1, 1);
      var result2 = notEquals(1, 1);

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
    it("should return true when a function returns false", function() {
      // 1: SETUP
      var returnTrue = () => true;

      // 2: TEST
      var returnFalse = X.utils.complement(returnTrue);

      // 3: ASSERT
      expect(returnFalse()).toBe(false);
    });

    it("should work on curried functions", function() {
      // 1: SETUP
      var isGreaterThan = (threshold, num) => {
        return num > threshold;
      };
      var isGreaterThanCurry = X.utils.curry(2, isGreaterThan);

      // 2: TEST
      var isLesserThan = X.utils.complement(isGreaterThanCurry);
      var isLesserThan10 = isLesserThan(10);

      // 3: ASSERT
      expect(isLesserThan10(5)).toBe(true);
    });
  });

  describe("X.utils.always()", function() {
    it("should return the same value no matter what is passed to it", function() {
      // 1: SETUP
      var always1 = X.utils.always(1);

      // 2: TEST
      var result1 = always1(null);
      var result2 = always1();

      // 3: ASSERT
      expect(result1).toBe(1);
      expect(result2).toBe(1);
    });
  });

  describe("X.utils.any()", function() {
    it("should return true if even just one of the items in an array matches the predicate", function() {
      // 1: SETUP
      var data = [1, 2, 3];
      var predicate = num => num > 2;

      // 2: TEST
      var result = X.utils.any(predicate, data);

      // 3: ASSERT
      expect(result).toBe(true);
    });

    it("should return false if none match", function() {
      // 1: SETUP
      var data = [1, 2, 3];
      var predicate = num => num > 3;

      // 2: TEST
      var result = X.utils.any(predicate, data);

      // 3: ASSERT
      expect(result).toBe(false);
    });
  });

  describe("X.utils.isNil()", function() {
    function test(value, result) {
      expect(X.utils.isNil(value)).toBe(result);
    }

    it("should return true for null, undefined, '', and NaN", function() {
      test(null, true);
      test(undefined, true);
      test("", true);
      test(NaN, true);
    });

    it("should not return true to empty objects and arrays", function() {
      test({}, false);
      test([], false);
    });
  });

  describe("X.utils.isRange()", function() {
    it("should return true if is a valid range", function() {
      // 1: SETUP
      var rangeValid = "1 - 100";
      var rangeInvalid = "-1 + 500";

      // 2: TEST
      var validResult = X.utils.isRange(rangeValid);
      var invalidResult = X.utils.isRange(rangeInvalid);

      // 3: ASSERT
      expect(validResult).toBe(true);
      expect(invalidResult).toBe(false);
    });
  });

  describe("X.utils.getRangeObject()", function() {
    it("should return an object with the range details", function() {
      // 1: SETUP
      var range = "1 - 10";

      // 2: TEST
      var result = X.utils.getRangeObject(range);

      // 3: ASSERT
      expect(result).toEqual(
        jasmine.objectContaining({
          start: 1,
          end: 10
        })
      );
    });

    it("should return null for invalid ranges", function() {
      // 1: SETUP
      var rangeInvalid = "-1 + 500";

      // 2: TEST
      var result = X.utils.getRangeObject(rangeInvalid);

      // 3: ASSERT
      expect(result).toEqual(null);
    });

    it("should interpret minus numbers", function() {
      // 1: SETUP
      var range1 = "-10 - 1";
      var range2 = "10 - -10";
      var range3 = "-100 - -10";

      // 2: TEST
      var result1 = X.utils.getRangeObject(range1);
      var result2 = X.utils.getRangeObject(range2);
      var result3 = X.utils.getRangeObject(range3);

      // 3: ASSERT
      expect(result1).toEqual(
        jasmine.objectContaining({
          start: -10,
          end: 1
        })
      );

      expect(result2).toEqual(
        jasmine.objectContaining({
          start: 10,
          end: -10
        })
      );

      expect(result3).toEqual(
        jasmine.objectContaining({
          start: -100,
          end: -10
        })
      );
    });
  });

  describe("X.utils.split()", function() {
    it("should split an array", function() {
      // 1: SETUP
      var string = "1-2-3";

      // 2: TEST
      var result = X.utils.split("-", string);

      // 3: ASSERT
      expect(result).toEqual(["1", "2", "3"]);
    });

    it("should curry", function() {
      // 1: SETUP
      var string1 = "a/b/c";
      var string2 = "x/y/z";

      // 2: TEST
      var splitOnSlash = X.utils.split("/");
      var result1 = splitOnSlash(string1);
      var result2 = splitOnSlash(string2);

      // 3: ASSERT
      expect(result1).toEqual(["a", "b", "c"]);
      expect(result2).toEqual(["x", "y", "z"]);
    });
  });

  describe("X.utils.removeWhiteSpace()", function() {
    it("should remove spaces and tabs from a string", function() {
      // 1: SETUP
      var string = "a b	c   ";

      // 2: TEST
      var result = X.utils.removeWhiteSpace(string);

      // 3: ASSERT
      expect(result).toBe("abc");
    });
  });

  describe("X.utils.isType()", function() {
    it("should return true if matches type", function() {
      expect(X.utils.isType("number", 10)).toBe(true);
    });

    it("should return false if does not match type", function() {
      expect(X.utils.isType("string", 10)).toBe(false);
    });
  });

  describe("X.utils.allPass()", function() {
    it("should return true if all predicates in array return true to input", function() {
      // 1: SETUP
      var p1 = function(v) {
        return v !== false;
      };

      var p2 = function(v) {
        return v !== "foobar";
      };

      var p3 = function(v) {
        return v !== 7;
      };

      var predicates = [p1, p2, p3];
      var test = X.utils.allPass(predicates);

      // 2: TEST
      var result1 = test("Passing Score");
      var result2 = test("foobar");

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  });

  describe("X.utils.propEq()", function() {
    it("should tell us if property equals expected value", function() {
      // 1: SETUP
      var obj = {
        foo: true,
        bar: false,
        nar: 0
      };

      // 2: TEST
      var result1 = X.utils.propEq("foo", true, obj);
      var result2 = X.utils.propEq("foo", false, obj);

      var result3 = X.utils.propEq("bar", false, obj);

      var result4 = X.utils.propEq("nar", 0, obj);
      var result5 = X.utils.propEq("nar", 1, obj);

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(true);
      expect(result4).toBe(true);
      expect(result5).toBe(false);
    });
  });

  describe("X.utils.tap()", function() {
    it("should cause a side effect", function() {
      // 1: SETUP
      var tapSpy = jasmine.createSpy("tapSpy");
      var pipeSpy = jasmine.createSpy("pipeSpy");

      var myPipe = X.utils.pipe(
        X.utils.tap(tapSpy),
        pipeSpy
      );

      // 2: TEST
      myPipe("foobar");

      // 3: ASSERT
      expect(tapSpy).toHaveBeenCalledWith("foobar");
      expect(pipeSpy).toHaveBeenCalledWith("foobar");
    });
  });

  describe("X.utils.prop()", function() {
    it("should when passed a property name and object return the value of that property", function() {
      // 1: SETUP
      var obj = {
        a: 1,
        b: 2
      };

      // 2: TEST
      var result1 = X.utils.prop("a", obj);
      var result2 = X.utils.prop("b", obj);
      var result3 = X.utils.prop("c", obj);

      // 3: ASSERT
      expect(result1).toBe(1);
      expect(result2).toBe(2);
      expect(result3).toBe(undefined);
    });
  });

  describe("X.utils.add()", function() {
    it("should add two numbers together", function() {
      expect(X.utils.add(1, 2)).toBe(3);
    });

    it("should curry", function() {
      // 1: SETUP
      var add1 = X.utils.add(1);

      // 2: TEST
      expect(add1(4)).toBe(5);
      expect(add1(10)).toBe(11);
    });
  });

  fdescribe("X.utils.whenAllParametersValid()", function() {
    it("should call a function when the value is not null", function() {
      // 1: SETUP
      var spy = jasmine.createSpy();

      // 2: TEST
      X.utils.whenAllParametersValid(spy, "foobar");

      // 3: ASSERT
      expect(spy).toHaveBeenCalledWith("foobar");
    });

    it("should not call the function when the value is null", function() {
      // 1: SETUP
      var spy = jasmine.createSpy();

      // 2: TEST
      X.utils.whenAllParametersValid(spy, null);

      // 3: ASSERT
      expect(spy).not.toHaveBeenCalled();
    });

	  it("should check all parameters", function () {
      // 1: SETUP
      var spy = jasmine.createSpy();

      // 2: TEST
      X.utils.whenAllParametersValid(spy)(1, 2, 3);

      // 3: ASSERT
      expect(spy).toHaveBeenCalledWith(1, 2, 3)
	  });
	  
  });

  describe("X.utils.drop()", function() {
    it("should remove X amount of items from start of list", function() {
      // 1: SETUP
      var string = "foobar";

      // 2: TEST
      var result = X.utils.drop(3, string);

      // 3: ASSERT
      expect(result).toBe("bar");
    });

	  it("should work on arrays", function () {

	  	// 1: SETUP
	  	var arr = [1, 2, 3, 4];

	  	// 2: TEST
	  	var result = X.utils.drop(2, arr);

	  	// 3: ASSERT
	  	expect(result).toEqual([3, 4])

	  });
	  
  });
  describe("X.utils.indexOf()", function() {
    it("should for strings return what number letter first holds this character", function() {
      // 1: SETUP
      var name = "tristan_ward";

      // 2: TEST
      var result = X.utils.indexOf("_", name);

      // 3: ASSERT
      expect(result).toBe(7);
    });

    it("should for strings return the index in the array which holds the object", function() {
      // 1: SETUP
      var a = [1, 2, 3];

      // 2: TEST
      var result = X.utils.indexOf(2, a);

      // 3: ASSERT
      expect(result).toBe(1);
    });
  });
  describe("X.utils.converge()", function() {
    it(
      "should accept (1) a converging function, (2) an array of functions equal length to" +
        "parameters needed for converging function and (3) a value. The array of functions transforms" +
        "the value and then passes it to the converging function",
      function() {
        // 1: SETUP
        var transformations = [X.utils.add(5), X.utils.add(10)];

        // 2: TEST
        var result = X.utils.converge(X.utils.subtract, transformations)(0);

        // 3: ASSERT
        expect(result).toBe(-5);
      }
    );
  });
  describe("X.utils.has()", function() {
    it("should tell us if an object has a property", function() {
      // 1: SETUP
      var obj = {
        foo: true,
        bar: false
      };

      // 2: TEST
      var result1 = X.utils.has("foo", obj);
      var result2 = X.utils.has("bar", obj);
      var result3 = X.utils.has("nar", obj);

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(false);
    });

    it("should tell us if an array contains a value", function() {
      // 1: SETUP
      var obj = {};
      var a = [obj, 1, true];

      // 2: TEST
      var result1 = X.utils.has(obj, a);
      var result2 = X.utils.has(1, a);
      var result3 = X.utils.has(true, a);

      var result4 = X.utils.has({}, a);
      var result5 = X.utils.has(false, a);

      // 3: ASSERT
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);

      expect(result4).toBe(false);
      expect(result5).toBe(false);
    });
  });
});
