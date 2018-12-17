/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/10/18
 * Time: 3:57 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("useRAFTiming", ["managers/preferences"], function () {

    "use strict";

    X.preferences.define({
        "name":"useRAFTiming",
        "animateRequired": true,
        "method":function (value) {

            if (!createjs || !createjs.Ticker) {
                console.error("Tried to change createjs.Ticker timing mode before it was loaded");

                return;
            }

            if (value) {

                createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

            } else {

                createjs.Ticker.timingMode = null;

            }

        },
        "default":true
    });



});