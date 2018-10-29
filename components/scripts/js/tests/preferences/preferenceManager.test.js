/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for X.preferences", function () {

    "use strict";

    var module = unitTests.requestModule("preferences/preferenceManager");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes
        };

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.preferences", function () {
        expect(X.preferences).toBeDefined();
    });
});