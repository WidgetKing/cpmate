/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
describe("BLAH BLAH", function () {

    var module = unitTests.requestModule("preferences/disableIFrameBorder");

    beforeEach(function () {

        console.log("About to log the method")
        console.log(module);

        module();

    });

    it("should work", function () {

        expect(window.X).toBeDefined();

    });

});