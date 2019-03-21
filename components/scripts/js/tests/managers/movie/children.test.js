/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 11:25 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/movie/children", function () {

    "use strict";

    var module = unitTests.requestModule("managers/movie/children"),
        utils = unitTests.requestModule("managers/utils"),

        sendTimeline = function (timeline) {
            module();
            X.movie.rootTimeline.changeCallback.sendToCallback("*", timeline);
        },

        mockTimeline = {
            "name":"main",
            "children": [

                {
                    "name":"child1"
                },

                {
                    "name":"child2",
                    "children": [

                        {
                            "name":"child2-1"
                        }

                    ]
                }
            ]
        };

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "movie":{
                "rootTimeline":{
                    "changeCallback": new unitTests.classes.Callback()
                }
            }
        };

        window.createjs = {
            "Ticker":{
                "on": function (a, f) {
                    f();
                }
            }
        };

        spyOn(X.movie.rootTimeline.changeCallback, "addCallback").and.callThrough();

        utils();
        module();

    });

    afterEach(function () {
        delete window.X;
    });

    it("should listen for new main timelines", function () {
        expect(X.movie.rootTimeline.changeCallback.addCallback).toHaveBeenCalled();
    });

    it("should define X.movie.children", function () {

        expect(X.movie.children).toBeDefined();

    });

    it("should create a list of all children", function () {

        sendTimeline({
            "name":"main",
            "children": [

                {
                    "name":"child1"
                },

                {
                    "name":"child2",
                    "children": [

                        {
                            "name":"child2-1"
                        }

                    ]
                }
            ]
        });

        var a = jasmine.anything();

        expect(X.movie.children.list).toEqual(
            {
                "main":a,
                "child1":a,
                "child2":a,
                "child2-1":a
            }
        );

    });

    it("should notify Callback when new list of children is found", function () {

        var callback = jasmine.createSpy("callback");
        X.movie.children.changeCallback.addCallback("*", callback);

        X.movie.rootTimeline.changeCallback.sendToCallback("*", mockTimeline);

        expect(callback).toHaveBeenCalled();

    });

    it("should update the children.exist property", function () {

        expect(X.movie.children.exist).toBe(false);

        X.movie.rootTimeline.changeCallback.sendToCallback("*", {});

        expect(X.movie.children.exist).toBe(false);

        X.movie.rootTimeline.changeCallback.sendToCallback("*", mockTimeline);

        expect(X.movie.children.exist).toBe(true);

    });

    it("should implement X.movie.children.getListMatchingSuffix", function () {

        X.movie.children.list = {

            "foobar": "[foobar]",
            "foo_bar": "[foo_bar]",
            "too_bar": "[too_bar]"

        };

        expect(X.movie.children.getListMatchingSuffix("_bar")).toEqual({

            "foo_bar": "[foo_bar]",
            "too_bar": "[too_bar]"

        })

    });
});
