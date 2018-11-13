/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/animate", function () {

    "use strict";

    var callWhenLoadedList = [],
        waitingForAnimateLoadInterval;

    function isAnimateLoaded () {
        return window.hasOwnProperty("stage");
    }

    function setUpAnimateLoadInterval () {

        waitingForAnimateLoadInterval = window.setInterval(function () {

            if (window.stage) {

                window.clearInterval(waitingForAnimateLoadInterval);

                for (var i = 0; i < callWhenLoadedList.length; i += 1) {

                    callWhenLoadedList[i]();

                }

                callWhenLoadedList = null;

            }

        }, 10);

    }

    X.animate = {

        "callWhenLoaded": function (method) {

            if (isAnimateLoaded()) {

                method();

            } else {

                callWhenLoadedList.push(method);


                if (!waitingForAnimateLoadInterval) {

                    setUpAnimateLoadInterval();

                }
            }

        }

    };

    X.animate.callWhenLoaded(function () {

        X.animate.mainTimeline = stage.children[0];

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