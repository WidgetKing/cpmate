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
                "extra": {
                    "safeEval": jasmine.createSpy("_extra.safeEval()")
                },
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
        var func = function foobar () {

        };

        // 2: Run
        X.runInCaptivateWindow(func);

        // 3: Assert
        expect(X.captivate.extra.safeEval).toHaveBeenCalledWith(jasmine.any(String), undefined);

    });

    it("should NOT run any code if Captivate is not present", function () {

        // 1: Setup
        delete X.captivate.extra;

        function test() {
            X.runInCaptivateWindow("foobar");
        }

        // 2: Run
        // 3: Assert
        expect(test).not.toThrowError();

    });


});