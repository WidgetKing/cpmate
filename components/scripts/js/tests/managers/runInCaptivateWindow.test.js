/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:50 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/runInCaptivateWindow", function () {

    "use strict";

    var module = unitTests.requestModule("managers/runInCaptivateWindow"),
        isCaptivateLoaded = true;

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "captivate":{
                "isLoaded": function () {
                    return isCaptivateLoaded;
                },
                "window":{
                    "eval": jasmine.createSpy("captivate.window.eval()")
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.runInCaptivateWindow", function () {

        expect(X.runInCaptivateWindow).toBeDefined();

    });

    it("should run code in the captivate window", function () {

        // 1: Setup
        isCaptivateLoaded = true;

        // 2: Run
        X.runInCaptivateWindow("foobar");

        // 3: Assert
        expect(X.captivate.window.eval).toHaveBeenCalledWith("foobar");

    });

    it("should NOT run any code if Captivate is not present", function () {

        // 1: Setup
        isCaptivateLoaded = false;

        // 2: Run
        X.runInCaptivateWindow("foobar");

        // 3: Assert
        expect(X.captivate.window.eval).not.toHaveBeenCalled()
    });


});