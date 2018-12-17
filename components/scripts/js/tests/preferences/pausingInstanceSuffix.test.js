/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 10:42 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for preferences/pausingInstanceSuffix", function () {

    "use strict";

    var module = unitTests.requestModule("preferences/pausingInstanceSuffix"),
        utils = unitTests.requestModule("managers/utils"),

        pausingInstanceSuffix,

        createMockMovieClip = function () {
            return {
                "play": jasmine.createSpy("play"),
                "stop": jasmine.createSpy("stop")
            }
        },

        children = {
            "foo_1": createMockMovieClip(),
            "bar_1": createMockMovieClip()
        };

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "preferences":{
                "define": function (data) {
                    pausingInstanceSuffix = data.method;
                }
            },
            "movie":{
                "children":{
                    "exist":true,
                    "getListMatchingSuffix": function () {
                        return children;
                    },
                    "changeCallback": new unitTests.classes.Callback()
                },
                "changeCallback": new unitTests.classes.Callback()
            }
        };

        utils();
        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should register the pausingInstanceSuffix preference", function () {

        expect(pausingInstanceSuffix).toBeDefined();

    });

    it("should pause matching children when slide paused, play when slide played", function () {

        pausingInstanceSuffix("_1");

        X.movie.changeCallback.sendToCallback("stop");
        expect(children.foo_1.stop).toHaveBeenCalled();
        expect(children.bar_1.stop).toHaveBeenCalled();

        X.movie.changeCallback.sendToCallback("play");
        expect(children.foo_1.play).toHaveBeenCalled();
        expect(children.bar_1.play).toHaveBeenCalled();

    });


});