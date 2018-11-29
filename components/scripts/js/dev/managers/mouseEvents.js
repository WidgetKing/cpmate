/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/mouseEvents", ["elements/slideObject"], function () {

    "use strict";

    var listeners = [];

    if (!X.slideObject || !X.slideObject.proxy) {
        return;
    }

    function forwardEvent (eventName) {

        function handler() {
            X.slideObject.proxy.dispatchEvent(eventName);
        }

        listeners.push({
            "eventName":eventName,
            "handler":handler
        });

        document.addEventListener(eventName, handler);

    }

    var isMobile = 'ontouchstart' in document.documentElement;

    [
        "click",
        "doubleclick",
        "contextmenu",
        "mouseover",
        "mouseout",
        (isMobile) ? "touchmove" : "mousemove",
        (isMobile) ? "touchstart" : "mousedown",
        (isMobile) ? "touchend" : "mouseup"

    ].forEach(function (eventName) {
        forwardEvent(eventName);
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// Unload
    ///////////////////////////////////////////////////////////////////////
    X.broadcast.addCallback("unload", function () {

        listeners.forEach(function (data) {

            document.removeEventListener(data.eventName, data.handler);

        });

        listeners = null;

    })
});