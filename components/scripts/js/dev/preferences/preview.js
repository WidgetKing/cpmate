/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/29/18
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/preferences/preview", ["managers/preferences"], function () {

    "use strict";

    X.preferences.define({
        "name":"preview",
        "animateRequired": true,
        "method":function (symbolName) {

            if (X.captivate.isLoaded()) {
                return;
            }

            X.movie.rootTimeline.set(symbolName);

            document.addEventListener("click", X.movie.play);

        }
    });

});