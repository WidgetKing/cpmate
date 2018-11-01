/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */
describe("test suite for captivate/elementLocator", function () {

    var module = unitTests.requestModule("elements/captivate");

    beforeEach(function () {

        window.X = {

        };

        window.parent.cp = {};
        window.parent._extra = {};

        module();

    });

    afterEach(function () {
        delete window.X;
        delete window.parent.cp;
        delete window.parent._extra;
    });

    it("should define X.captivate", function () {
        expect(X.captivate).toBeDefined();
    });

    it("should define X.captivate.window", function () {
        expect(X.captivate.window).toBeDefined();
    });

    it("should define X.captivate.base", function () {
        expect(X.captivate.base).toBeDefined();
    });

    it("should identify if loaded in captivate", function () {
        expect(X.captivate.isLoaded()).toBe(true);
    });

    it("should identify if cpextra loaded", function () {
        expect(X.captivate.isLoaded()).toBe(true);
    });
});