/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/mouseEvents", ["managers/utils", "elements/slideObject"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
	////////////// PUBLIC INTERFACE
    ///////////////////////////////////////////////////////////////////////
	
	var mobileEvents = {
		"mousemove":"touchmove",
		// Stragely, once createjs.Touch is enabled although the other
		// touch events need to be used, mouse down does not
		// Go figure
		// "mousedown":"touchstart",
		"mouseup":"touchend"
	};
	
	X.events = {
		"getSafeEvent": function (eventName) {
			if (X.utils.isMobile && mobileEvents.hasOwnProperty(eventName)) {
				return mobileEvents[eventName];
			}
			return eventName;
		}
	}
	
	
	
	
    ///////////////////////////////////////////////////////////////////////
	////////////// ENABLE FOR MOBILE
    ///////////////////////////////////////////////////////////////////////
	createjs.Touch.enable(X.animate.stage, true);

    ///////////////////////////////////////////////////////////////////////
	////////////// HANDLE DOCUMENT EVENTS
    ///////////////////////////////////////////////////////////////////////
	
	var listeners = [];


    if (!X.slideObject || !X.slideObject.proxy) {
        return;
    }

    function forwardEvent (eventName) {

		var safeEventName = X.events.getSafeEvent(eventName);

        function handler() {
            X.slideObject.proxy.dispatchEvent(safeEventName);
        }

        listeners.push({
            "eventName":safeEventName,
            "handler":handler
        });

        document.addEventListener(safeEventName, handler);

    }


    [
        "click",
        "doubleclick",
        "contextmenu",
        "mouseover",
        "mouseout",
        "mousemove",
        "mousedown",
        "mouseup"

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
