/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for X.preferences", function () {

    "use strict";

    var module = unitTests.requestModule("preferences/preferenceManager"),
        onLoadCallback;

    beforeEach(function () {
        window.X = {};

        onLoadCallback = module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.preferences", function () {
        expect(X.preferences).toBeDefined();
    });

    it("should allow us to define set method for preferences", function () {

        var setPreference = jasmine.createSpy(function (value) {
            expect(value).toBe("bar");
        });

        X.preferences.define("foo", setPreference);

        onLoadCallback();

        X.preferences.foo = "bar";
        expect(setPreference).toHaveBeenCalled();

        expect(X.preferences.foo).toBe("bar");


    });
});