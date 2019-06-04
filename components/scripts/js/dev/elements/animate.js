/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/animate", [], function () {

    "use strict";

    var callWhenLoadedList = [],
        waitingForAnimateLoadInterval;

    function isAnimateLoaded () {
        return window.stage;
    }

    function animateLoadIntervalHandler () {

        if (isAnimateLoaded()) {

            window.clearInterval(waitingForAnimateLoadInterval);

            for (var i = 0; i < callWhenLoadedList.length; i += 1) {

                callWhenLoadedList[i]();

            }

            waitingForAnimateLoadInterval = null;
            callWhenLoadedList = null;

        }

    }

    function setUpAnimateLoadInterval () {

        waitingForAnimateLoadInterval = window.setInterval(animateLoadIntervalHandler, 10);

    }

    X.animate = {

        "callWhenLoaded": function (method) {

            if (isAnimateLoaded()) {

                if (waitingForAnimateLoadInterval) {

                    // Oh, the interval has not discovered animate is loaded
                    // Strange as it may seem, I've actually had this happen.
                    callWhenLoadedList.push(method);
                    animateLoadIntervalHandler();

                } else {

                    method();

                }


            } else {

                callWhenLoadedList.push(method);

                if (!waitingForAnimateLoadInterval) {

                    setUpAnimateLoadInterval();

                }
            }

        }

    };

    X.animate.callWhenLoaded(function () {

        X.animate.stage = stage;

		// Now that we have access to the stage it's important we add
		// support for touch events.
		// We put this code here rather than in another file because
		// the stage takes an arbitrary amount of time to load.
		// Therefore this is the safest place to put it.
		createjs.Touch.enable(X.animate.stage, true);

        X.animate.mainTimeline = stage.children[0];

        if (window.AdobeAn) {

            X.animate.library = AdobeAn.getComposition(AdobeAn.bootcompsLoaded[0]).getLibrary();

        }

		// Now is the point where it is safe for the nimation to play
		document.dispatchEvent
    });

    /*
    var time = 0;

    var interval = window.setInterval(function () {

        if (window.stage) {

            console.log("Ready: " + time);
            console.log(stage)
            window.clearInterval(interval);

        }

        time += 10;

    }, 10);

    window.addEventListener("load", function () {
        console.log(stage);
        X.animate = {
            "mainTimeline": stage.children[0]
        }
    });
*/
});
