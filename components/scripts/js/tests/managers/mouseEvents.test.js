/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:25 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/mouseEvents", function () {

    "use strict";

    var module = unitTests.requestModule("managers/mouseEvents");

    beforeEach(function () {
        window.X = {
            "classes":unitTests.classes,
            "slideObject":{
                "proxy":{
                    "dispatchEvent": jasmine.createSpy()
                }
            },
            "broadcast": new unitTests.classes.Callback()
        };

        spyOn(document, "addEventListener");
        spyOn(document, "removeEventListener");

        module();
    });

    afterEach(function () {
        delete window.X;
    });

    it("should listen for mouse events", function () {
        function listeningFor (eventName) {
            expect(document.addEventListener).toHaveBeenCalledWith(eventName, jasmine.anything());
        }

        listeningFor("mouseover");
        listeningFor("mouseout");
        listeningFor("mousedown");
        listeningFor("mouseup");
        listeningFor("click");
        listeningFor("doubleclick");
        listeningFor("contextmenu");
    });

    it("should stop listening for mouse events when it hears unload", function () {

        function stopListeningFor (eventName) {
            expect(document.removeEventListener).toHaveBeenCalledWith(eventName, jasmine.anything());
        }

        X.broadcast.sendToCallback("unload");

        stopListeningFor("mouseover");
        stopListeningFor("mouseout");
        stopListeningFor("mousedown");
        stopListeningFor("mouseup");
        stopListeningFor("click");
        stopListeningFor("doubleclick");
        stopListeningFor("contextmenu");

    });
});