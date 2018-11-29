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
                "rootTimeline":{
                    "set":jasmine.createSpy("movie.rootTimeline.set")
                }
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
        expect(X.movie.rootTimeline.set).not.toHaveBeenCalled();
    });

    it("should detect correct symbol in the library symbol and pass name to X.movie.rootTimeline.set", function () {

        // ---- Setup

        X.slideObject.name = "foo";
        X.animate.library.foo = function () {

        };

        // ---- Test

        linkNameToLibrarySymbol(true);
        expect(X.movie.rootTimeline.set).toHaveBeenCalledWith("foo");

    });

    it("should find the library symbol even if slideObject.name has a '_#' suffix", function () {

        X.slideObject.name = "foo_bar_1";
        X.animate.library.foo_bar = function () {

        };

        // ---- Test
        linkNameToLibrarySymbol(true);

        expect(X.movie.rootTimeline.set).toHaveBeenCalledWith("foo_bar");

    });
});