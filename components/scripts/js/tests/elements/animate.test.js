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
            return 12345;
        });
        spyOn(window, "clearInterval");

        module();
    });

    afterEach(function () {
        delete window.X;
        delete window.stage;
        onLoaded = null;
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

    it("should, when adding a callback when animate is loaded but before the interval has discovered it, call qued callbacks first", function () {

        var callOrder = [],
            spy1 = jasmine.createSpy("spy1").and.callFake(function () {
                callOrder.push("spy1");
            }),
            spy2 = jasmine.createSpy("spy2").and.callFake(function () {
                callOrder.push("spy2");
            });

        X.animate.callWhenLoaded(spy1);

        // ---- Part 1
        expect(spy1).not.toHaveBeenCalled();
        expect(window.setInterval).toHaveBeenCalled();

        // ---- Part 1
        window.stage = getMockStageObject();
        X.animate.callWhenLoaded(spy2);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(callOrder).toEqual(["spy1", "spy2"]);
        expect(window.clearInterval).toHaveBeenCalled();


    });
});
