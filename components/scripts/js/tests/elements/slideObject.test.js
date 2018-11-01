/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 10:26 AM
 * To change this template use File | Settings | File Templates.
 */
xdescribe("test suite for elements/slideObject", function () {

    var module = unitTests.requestModule("elements/slideObject");

    beforeEach(function () {

        window.X = {
            "captivate":{
                "hasCpExtra":function () {
                    return true;
                },
                "isLoaded": function () {
                    return true;
                }
            }
        };

        module();

    });

    afterEach(function () {
        delete window.X;
    });

    it("should define X.slideObject", function () {

        expect(X.slideObject).toBeDefined();

    });

    xit("should locate the slideObject name", function () {

        expect(X.slideObject.name).toBe("foobar")

    });

});