/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/29/18
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for X.movie.rootTimeline", function () {

    "use strict";

    var module = unitTests.requestModule("managers/movie/rootTimeline");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "movie":{
                "_setRootTimeline": jasmine.createSpy("movie._setRootTimeline")
            },
            "animate":{
                "library":{

                },
                "mainTimeline":{
                    "addChild": jasmine.createSpy("animate.mainTimeline.addChild")
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.movie.rootTimeline", function () {
        expect(X.movie.rootTimeline).toBeDefined();
    });

    it("should pass an instantiated timeline along to movie._setRootTimeline", function () {

        var timeline = {

        };

        X.movie.rootTimeline.set(timeline);

        expect(X.movie._setRootTimeline).toHaveBeenCalledWith(timeline);

    });

    it("should recognize a symbol name, instantiate it, then send it to movie._setRootTimeline", function () {

        // ---- Setup
        var instantiated = false,
            instance;

        X.animate.library.foo = function () {
            instantiated = true;
        };


        X.movie._setRootTimeline.and.callFake(function (i) {

           instance = i;

        }) ;

        // ---- Test
        X.movie.rootTimeline.set("foo");

        expect(instantiated).toBe(true);
        expect(X.movie._setRootTimeline).toHaveBeenCalled();
        expect(X.animate.mainTimeline.addChild).toHaveBeenCalled();
        expect(instance.constructor).toBe(X.animate.library.foo);

    });

});