/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/debugging/logging and errors", function () {

    "use strict";

    var module = unitTests.requestModule("managers/debugging/logging");
    var errors = unitTests.requestModule("managers/debugging/errors");

    var inCaptivate = true;

    beforeEach(function () {

        inCaptivate = true;

        window.X = {
            "captivate":{
                "isLoaded": function () {
                    return inCaptivate;
                },
                "alert":jasmine.createSpy()
            }
        };

        errors();
        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.errors", function () {

        expect(X.errors).toBeDefined();

    });

    it("should define X.log, X.alert and X.error", function () {
        expect(X.log).toBeDefined();
        expect(X.error).toBeDefined();
        expect(X.alert).toBeDefined();
    });

    it("should make X.alert pop up visible error messages no matter whether in Captivate or not", function () {

        spyOn(window, "alert");
        inCaptivate = false;

        X.alert("foobar");

        expect(window.alert).toHaveBeenCalledWith("foobar");

        // -----------------------

        inCaptivate = true;

        X.alert("foobar");

        expect(X.captivate.alert).toHaveBeenCalledWith("foobar", undefined);

    });

    it("should throw errors with messages written in X.errors", function () {

        spyOn(X,"alert");

        X.errors.MyError = jasmine.createSpy(function () {
            return "foobar";
        });

        X.error("MyError");

        expect(X.alert).toHaveBeenCalled();
        expect(X.errors.MyError).toHaveBeenCalled();

    });

    it("should pass on any number of extra parameters to error method when calling error code on X.error", function () {

        X.errors.MyError = jasmine.createSpy();

        X.error("MyError", 1, 2, 3);

        expect(X.errors.MyError).toHaveBeenCalledWith(1, 2, 3);

    });

});