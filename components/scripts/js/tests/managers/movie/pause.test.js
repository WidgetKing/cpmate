/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 1:32 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/movie/pause", function () {

    "use strict";

    var module = unitTests.requestModule("managers/movie/pause"),
        hook = unitTests.requestModule("managers/hook");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "movie":{

            }
        };

        hook();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define X.movie.pause", function () {
        expect(X.movie.pause).toBeDefined();
    });
});