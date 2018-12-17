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



});