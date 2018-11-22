/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 1:29 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/pause", ["managers/movie"], function () {

    "use strict";

    var rootTimeline;

    X.movie.pause = {

        "type": {
            "FRAME_SCRIPT":"frame_script",
            "CAPTIVATE_PAUSED":"captivate_paused"
        },

        "setRootTimeline": function (timeline) {

            if (rootTimeline) {
                X.removeHook(rootTimeline, "stop", reactToPause);
            }

            rootTimeline = timeline;

            X.addHook(rootTimeline, "stop", reactToPause);

        },

        "reason":null
    };

    function reactToPause (reason) {

        if (!reason) {
            reason = X.movie.pause.type.FRAME_SCRIPT;
        }

        X.movie.pause.reason = reason;

    }

});