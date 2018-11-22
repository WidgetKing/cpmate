/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:50 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/cpExtraActions", function () {

    "use strict";

    var module = unitTests.requestModule("managers/cpExtraActions"),
        callback;

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "captivate":{
                "extra":{
                    "cpMate": {
                        "register": jasmine.createSpy("_extra.cpMate.register").and.callFake(
                            function (slideObjectName, c) {
                                callback = c;
                            }
                        ),
                        "deregister": jasmine.createSpy("deregister")
                    }
                }
            },
            "slideObject":{
                "name":"slideObjectName"
            },
            "error":jasmine.createSpy()
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should register with cpExtra broadcaster for personal and global events", function () {
        expect(X.captivate.extra.cpMate.register).toHaveBeenCalledWith("slideObjectName", jasmine.anything());
        expect(X.captivate.extra.cpMate.register).toHaveBeenCalledWith("*", jasmine.anything());
    });

    it("should define the cpExtraActions list", function () {

        expect(X.cpExtraActions).toBeDefined();

    });

    it("should allow us to register an action and have it called from CpExtra", function () {

        var spy = jasmine.createSpy("spy");

        X.cpExtraActions.register("foobar", spy);

        callback({
            "action":"foobar",
            "parameters": [
                1,
                2
            ]
        });

        expect(spy).toHaveBeenCalledWith(1, 2);

    });

    it("should use cpExtraActions.unload to deregister with CpExtra", function () {

        X.cpExtraActions.unload();

        expect(X.captivate.extra.cpMate.deregister).toHaveBeenCalledWith("slideObjectName", jasmine.anything());
        expect(X.captivate.extra.cpMate.deregister).toHaveBeenCalledWith("*", jasmine.anything());

    });
});