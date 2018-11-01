/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
describe("test suite for preferences/disableIFrameBorder", function () {

    var module = unitTests.requestModule("preferences/disableIFrameBorder");
    var disableIFrameBorder;

    beforeEach(function () {

        window.X = {
            "preferences": {
                "define": function (name, method) {
                    disableIFrameBorder = method;
                }
            }

        };

        module();

    });

    afterEach(function () {
        disableIFrameBorder = null;
        delete window.X;
    });

    it("should register the disableIFrameBorder method", function () {

        expect(disableIFrameBorder).not.toBeNull();

    });

    it("should change the main div border when set", function () {



    });


});