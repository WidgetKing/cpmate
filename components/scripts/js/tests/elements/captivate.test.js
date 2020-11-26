/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:55 PM
 * To change this template use File | Settings | File Templates.
 */
describe("test suite for elements/captivate", function () {

    var module = unitTests.requestModule("elements/captivate");

    beforeEach(function () {

        window.X = {
            "error":jasmine.createSpy(),
        };

        window.parent.cp = {};
        window.parent._extra = {};
        window.parent.X = {
            "version":"1.4.2"
        };

    });

    afterEach(function () {
        delete window.X;
        delete window.parent.cp;
        delete window.parent._extra;
        delete window.parent.X;
    });

    it("should define X.captivate", function () {
        module();
        expect(X.captivate).toBeDefined();
    });

    it("should define X.captivate.window", function () {
        module();
        expect(X.captivate.window).toBeDefined();
    });

    it("should define X.captivate.base", function () {
        module();
        expect(X.captivate.base).toBeDefined();
    });

    it("should identify if loaded in captivate", function () {
        module();
        expect(X.captivate.isLoaded()).toBe(true);
    });

    it("should identify if cpextra loaded", function () {
        module();
        expect(X.captivate.hasCpExtra()).toBe(true);
    });

    it("should throw error is Captivate is loaded by CpExtra isn't", function () {

        delete window.parent._extra;
        module();
        expect(X.captivate.hasCpExtra()).toBe(false);
        expect(X.error).toHaveBeenCalledWith("GE001");

    });

    it("should locate CpExtra's public interface", function () {

        module();
        expect(X.captivate.extraPublicInterface).toBeDefined();

    });

    it("should identify CpExtra's version", function () {

        module();
        expect(X.captivate.extraVersion).toBe("1.4.2");

    });

    it("should throw an error if the installed CpExtra is below the minimum version", function () {

        window.parent.X.version = "1.4.1";
        module();
        expect(X.error).toHaveBeenCalledWith("GE002", "1.4.1", "1.4.2");

    });
});
