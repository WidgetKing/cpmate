/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for X.preferences", function () {

    "use strict";

    var module = unitTests.requestModule("managers/preferences"),
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

        X.preferences.define({
            "name":"foo",
            "method":setPreference
        });

        onLoadCallback();

        X.preferences.foo = "bar";
        expect(setPreference).toHaveBeenCalled();

        expect(X.preferences.foo).toBe("bar");


    });

    it("should not send the value down to the method if the value has not changed", function () {

        var setPreference = jasmine.createSpy();
        X.preferences.define({
            "name":"foo",
            "method":setPreference
        });

        onLoadCallback();

        X.preferences.foo = "bar";
        expect(setPreference).toHaveBeenCalled();

        setPreference.calls.reset();

        X.preferences.foo = "bar";
        expect(setPreference).not.toHaveBeenCalled();

    });

    it("should allow preferences to set their own defaults", function () {

        var setPreference = jasmine.createSpy();

        X.preferences.define({
            "name":"foo",
            "method":setPreference,
            "default":"bar"
        });

        expect(setPreference).toHaveBeenCalledWith("bar");

    });

});