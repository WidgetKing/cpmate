describe("A test suite for managers/mouseEvents", function () {

    "use strict";

    var module = unitTests.requestModule("managers/mouseEvents");

    beforeEach(function () {
        window.X = {
			"utils": {
				"isMobile": false
			},
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

    });

    afterEach(function () {
        delete window.X;
    });

    it("should listen for mouse events", function () {
        module();

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

        module();

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

	it("should also listen to the correct mobile events", function () {

		// TEST
		X.utils.isMobile = true;

		module();

		// ASSERT
		expect(document.addEventListener).toHaveBeenCalledWith("touchstart", jasmine.any(Function));

	});


	it("should give us access to the appropriate event name for mobile/desktop", function () {

		// 1: SETUP

		function shouldGetInReturnTo(result, event) {
			expect(X.events.getSafeEvent(event)).toBe(result);
		}

		X.utils.isMobile = true;

		module();


		// 2: TEST
		shouldGetInReturnTo('touchstart', 'mousedown');
		shouldGetInReturnTo('touchmove', 'mousemove');
		shouldGetInReturnTo('touchend', 'mouseup');
		shouldGetInReturnTo('click', 'click');

		// TEARDOWN
		delete window.document.documentElement.ontouchstart;
	});
});
