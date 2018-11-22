/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 9:19 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for preferences/linkNameToLibrarySymbol", function () {

    "use strict";

    var module = unitTests.requestModule("preferences/linkNameToLibrarySymbol"),
        linkNameToLibrarySymbol;

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "preferences":{
                "define": function (data) {
                    linkNameToLibrarySymbol = data.method;
                }
            },
            "animate":{
                "library":{

                },
                "mainTimeline":{
                    "addChild": jasmine.createSpy("animate.maintimeline.addChild()")
                }
            },
            "slideObject":{
                "name": "slideObjectName"
            },
            "movie":{
                "setRootTimeline":jasmine.createSpy()
            },
            "log": jasmine.createSpy("X.log")
        };

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should not create an animation if none defined by this name", function () {
        X.slideObject.name = "foo";
        delete X.animate.library.foo;
        linkNameToLibrarySymbol(true);

        expect(X.log).toHaveBeenCalled();
        expect(X.movie.setRootTimeline).not.toHaveBeenCalled();
    });

    it("should create an instance of the library symbol and pass it on", function () {

        // ---- Setup
        var instantiated = false,
            instance;

        X.slideObject.name = "foo";
        X.animate.library.foo = function () {
            instantiated = true;
        };

        X.movie.setRootTimeline.and.callFake(function (i) {
            instance = i;
        }) ;

        // ---- Test
        linkNameToLibrarySymbol(true);

        expect(instantiated).toBe(true);
        expect(X.movie.setRootTimeline).toHaveBeenCalled();
        expect(X.animate.mainTimeline.addChild).toHaveBeenCalled();
        expect(instance.constructor).toBe(X.animate.library.foo);

    });

    it("should find the library symbol even if slideObject.name has a '_#' suffix", function () {

        X.slideObject.name = "foo_bar_1";
        X.animate.library.foo_bar = function () {

        };

        // ---- Test
        linkNameToLibrarySymbol(true);

        expect(X.movie.setRootTimeline).toHaveBeenCalled();

    });
});