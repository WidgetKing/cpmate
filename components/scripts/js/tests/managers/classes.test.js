/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/classes", function () {

    "use strict";

    var module = unitTests.requestModule("managers/classes");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define X.classes", function () {
        expect(X.classes).toBeDefined();
    });

    it("should allow us to define a class", function () {

        function MyClass () {

        }

        X.classes.register("MyClass", MyClass);

        expect(X.classes.MyClass).toEqual(MyClass);

    });
});