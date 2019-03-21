/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/utils", function () {

    "use strict";

    var module = unitTests.requestModule("managers/utils");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes
        };

        module();
    });

    afterEach(function () {
        delete window.X;
        delete window.createjs;
    });

    it("should define X.utils", function () {
        expect(X.utils).toBeDefined();
    });

    it("should implement X.utils.onNextTick", function () {

        // ---- SETUP
        var c,
            tick = function () {
                c();
            };

        window.createjs = {
            "Ticker":{
                "on": function (a, f) {
                    c = f
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

    it("should implement X.utils.singleton", function () {

        var spy = jasmine.createSpy("spy"),
            foobar = X.utils.singleton(spy);

        foobar("parameter");

        expect(spy).toHaveBeenCalledWith("parameter");

        spy.calls.reset();

        foobar();

        expect(spy).not.toHaveBeenCalled();

    });

    it("should implement X.utils.callIfDefined", function () {

        var data = {
            "defined": jasmine.createSpy("definedCallback"),
            "notDefined":undefined
        };

        // ---- Test 1
        X.utils.callIfDefined(data.defined, 1, 2, 3);
        expect(data.defined).toHaveBeenCalledWith(1, 2, 3);

        // ---- Test 2
        expect(function () {

            X.utils.callIfDefined(data.notDefined, 1, 2, 3);

        }).not.toThrow();

        // ---- Test 3
        expect(X.utils.callIfDefined(function (p) {
            return p;
        }, "hello")).toBe("hello");


    });

    it("should implement X.utils.callByType", function () {

        var data = {
                "string": function () {
                    return "string";
                },
                "number": function () {
                    return "number";
                },
                "object": function () {
                    return "object";
                },
                "array": function () {
                    return "array";
                }
            };

        function test (parameter, r) {
            expect(X.utils.callByType(parameter, data)).toEqual(r);
        }

        test("hello world", "string");
        test(123, "number");
        test({}, "object");
        test([], "array");

    });


    it("should implement X.utils.hasSuffix", function () {

        expect(X.utils.hasSuffix("foo_bar", "_bar")).toBe(true);
        expect(X.utils.hasSuffix("foo_bar", "_boo")).toBe(false);

    });

    it("should implement X.utils.isEmpty", function () {

        expect(X.utils.isEmpty({})).toBe(true);
        expect(X.utils.isEmpty({"key":"value"})).toBe(false);

        expect(X.utils.isEmpty([])).toBe(true);
        expect(X.utils.isEmpty(["value"])).toBe(false);

    });


    describe("tests for X.utils.forEach", function () {

        it("should loop through arrays", function () {

            var calls = [];

            X.utils.forEach([1, 2, 3, 4], function (p) {
                calls.push(p);
            });

            expect(calls).toEqual([1,2,3,4]);

        });

        it("should loop through objects", function () {

            var calls = [];

            X.utils.forEach({
                "a":1,
                "b":2,
                "c":3
            },

            function (key) {
                calls.push(key);
            });

            expect(calls).toEqual(["a", "b", "c"]);

        });

    });

    describe("X.utils.defaultTo()", function () {

      function defaultToEquals(data) {

        var result = X.utils.defaultTo(data.def, data.obj);
        expect(result).toEqual(jasmine.objectContaining(data.result));

      }

      it("should provide single level object defaults", () => {

        // 1: SETUP
        defaultToEquals({
          "obj": {
            "foo":true
          },
          "def": {
            "foo": false,
            "bar": false
          },
          "result": {
            "foo": true,
            "bar": false
          }
        });

        // 2: TEST


        // 3: ASSERT

      });

      it("should provide multi-level object defaults", () => {

        // 1: SETUP

        defaultToEquals({
          "obj": {
            "foo":true,
            "bar":{
              "scooby":true
            }
          },
          "def": {
            "foo": false,
            "bar": {
              "scooby": false,
              "doo": false
            },
            "tzar":{
              "humbug": false
            }
          },
          "result": {
            "foo": true,
            "bar": {
              "scooby": true,
              "doo": false
            },
            "tzar":{
              "humbug": false
            }
          }
        });

        // 2: TEST


        // 3: ASSERT

      });
    });

    describe("tests for X.utils.filter", function () {

        beforeEach(function () {
            this.test = function (a, fm, r) {
                expect(X.utils.filter(a, fm))
                    .toEqual(r);
            };
        });

        it("should filter arrays", function () {

            this.test([1,2,3,4,5],

                function (element) {
                    return element > 3;
                },

                [4,5]);

        });

        it("should filter objects", function () {

            this.test(

            {
                "a":1,
                "b":2,
                "c":3,
                "d":4
            },

            function (key, value) {
                return key === "c" || value === 4
            },

            {
                "c":3,
                "d":4
            }

            );

        });

        it("should filter strings", function () {

            this.test(

                "mississippi",

                function (letter) {
                    return letter === "s"
                },

                "ssss"

            )

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
          "props":["a", "b", "c"],
          "obj":{
            "a":true,
            "b":true,
            "c":true
          },
          "result":[]
        });

      });

      it("should return the name of a missing prop", () => {

        // 1: SETUP
        // 2: TEST
        // 3: ASSERT

        test({
          "props":["a", "b", "c"],
          "obj":{
            "a":true,
            "c":true
          },
          "result":["b"]
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
				"predicate": () => true,
				"methodCalled": true,
				"arguments": [],
				"returnValue": null
			});
			
		});
		
		it("should call the false method if predicate returns false", () => {
			
			// 1: SETUP
			// 2: TEST
			// 3: ASSERT
			test({
				"predicate": () => false,
				"methodCalled": false,
				"arguments": [],
				"returnValue": null
			});
			
		});

		it("should pass along arguments", () => {
			
			// 1: SETUP
			var predicateSpy = jasmine.createSpy('predicate').and.callFake(() => true);
			var trueSpy = jasmine.createSpy('true spy');
			var falseSpy = jasmine.createSpy("false spy");
			
			// 2: TEST
			X.utils.ifElse(predicateSpy, trueSpy, falseSpy)("foobar");
			// 3: ASSERT
			expect(predicateSpy).toHaveBeenCalledWith("foobar");
			expect(trueSpy).toHaveBeenCalledWith("foobar");
			
			
		});

		it("should return the true/false method's return argument", () => {
			
			// 1: SETUP
			var predicateSpy = jasmine.createSpy('predicate').and.callFake(() => true);
			var trueSpy = jasmine.createSpy('true spy').and.callFake(() => 'foobar');
			var falseSpy = jasmine.createSpy("false spy");
			
			// 2: TEST
			var returnValue = X.utils.ifElse(predicateSpy, trueSpy, falseSpy)("foobar");
			// 3: ASSERT
			expect(returnValue).toBe("foobar");
			
			
		});
	});

	describe("X.utils.when()", () => {

		it("should call a method when the predicate returns true", () => {
			
			// 1: SETUP
			var predicateSpy = jasmine.createSpy('predicate').and.callFake(() => true);
			var trueSpy = jasmine.createSpy('true spy');
			
			// 2: TEST
			X.utils.when(predicateSpy, trueSpy)("foobar");
			
			// 3: ASSERT
			expect(trueSpy).toHaveBeenCalledWith("foobar");
			expect(predicateSpy).toHaveBeenCalledWith("foobar");
			
		});
		

	});

	describe("X.utils.unless()", () => {

		it("should call a method when the predicate returns false", () => {
			
			// 1: SETUP
			var predicateSpy = jasmine.createSpy('predicate').and.callFake(() => false);
			var falseSpy = jasmine.createSpy('false spy');
			
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
			expect(result).toBe(.5);
			
		});

		it("should with a max of 10 and a min of -10 and a value of -8 give us .1", () => {
			
			// 1: SETUP
			// 2: TEST
			var result = X.utils.getPercent(-10, 10, -8);
			
			// 3: ASSERT
			expect(result).toBe(.1);
			
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
			var result = X.utils.calculatePercentInRange(10, 20, .5);
			
			// 3: ASSERT
			expect(result).toBe(15);
			
		});


		it("should with min of -10 and max of 10 and value of .25 return -5", () => {
			
			// 1: SETUP
			// 2: TEST
			var result = X.utils.calculatePercentInRange(-10, 10, .25);
			
			// 3: ASSERT
			expect(result).toBe(-5);
			
		});
	});

	describe("X.utils.reduce()", function () {
		
		it("should take a method and send the accumulated value and the current value into the method", function () {

			// 1: SETUP
			var list = ["a", "b", "c"];
			var intialValue = "z";
			var method = function (value, acc) {

				return acc + "_" + value;

			}
			

			// 2: TEST
			var result = X.utils.reduce(method, intialValue, list);

			// 3: ASSERT
			expect(result).toBe("z_a_b_c");


		});			
		
	});
	
	describe("X.utils.forEachUntil", function () {
		
		it("should keep looping through a list until the looping method returns something that matches the predicate", function () {

			// 1: SETUP
			var list = ["F", "B", "I"];

			function predicate (value) {

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
		
	});

	describe("X.utils.forEachUntilResult", function () {
		
		it("should keep looping through a list until the looping method returns something that matches the predicate", function () {

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

	describe("X.utils.both", function () {
		
		it("should return true if both the predicates return true", function () {

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

	describe("X.utils.either", function () {
		
		it("should return true if either the predicates return true", function () {

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
});
