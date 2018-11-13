/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 4:04 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for X.animate", function () {

    "use strict";

    var module = unitTests.requestModule("elements/animate"),
        onLoaded;

    function getMockStageObject () {
        return {
            "children":[
                {

                }
            ]
        };
    }

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes
        };

        spyOn(window, "setInterval").and.callFake(function (method) {
            onLoaded = method;
        });
        spyOn(window, "clearInterval");

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.animate", function () {
        expect(X.animate).toBeDefined();
    });

    it("should allow us to add callbacks for when easelJS is loaded", function () {

        var spy = jasmine.createSpy();

        X.animate.callWhenLoaded(spy);

        // ---- Part 1
        expect(spy).not.toHaveBeenCalled();
        expect(window.setInterval).toHaveBeenCalled();

        // ---- Part 2
        window.stage = getMockStageObject();
        onLoaded();
        expect(spy).toHaveBeenCalled();
        expect(window.clearInterval).toHaveBeenCalled();

        // ---- Part 3
        var spy2 = jasmine.createSpy();
        X.animate.callWhenLoaded(spy2);
        expect(spy2).toHaveBeenCalled();

    });
});