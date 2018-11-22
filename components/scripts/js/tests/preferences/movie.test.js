/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/movie", function () {

    "use strict";

    var module = unitTests.requestModule("managers/movie"),
        callWhenLoaded;

    beforeEach(function () {

        window.X = {
            "classes":unitTests.classes,
            "animate":{
                "callWhenLoaded": function (method) {
                    callWhenLoaded = method;
                },
                "mainTimeline":{
                    "play":jasmine.createSpy("maintimeline.play"),
                    "stop":jasmine.createSpy("maintimeline.stop"),
                    "gotoAndPlay":jasmine.createSpy("maintimeline.gotoAndPlay"),
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define X.movie", function () {
        expect(X.movie).toBeDefined();
    });

    it("should not throw an error if we try to change settings before animate loaded", function () {

        X.movie.play();

        expect(X.animate.mainTimeline.play).not.toHaveBeenCalled();

        callWhenLoaded();

        expect(X.animate.mainTimeline.play).toHaveBeenCalled();

    });
});