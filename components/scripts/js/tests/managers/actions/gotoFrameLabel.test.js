/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 11:53 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/actions/gotoFrameLabel", function () {

    "use strict";

    var module = unitTests.requestModule("managers/actions/gotoFrameLabel"),
        gotoFrame,
        labels;

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            'cpExtraActions':{
                "register": function (name, method) {
                    gotoFrame = method;
                }
            },
            "animate":{
                "callWhenLoaded": function (method) {
                    method();
                }
            },
            "movie":{
                "gotoAndPlay": jasmine.createSpy(),
                "getLabels": function () {
                    return labels;
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should play frame associated with frame label", function () {

        labels = [
            {
                "label":"1",
                "position":10
            }
        ];

        gotoFrame(1);
        expect(X.movie.gotoAndPlay).toHaveBeenCalledWith(10);

    });
});