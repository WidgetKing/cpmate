/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 10:45 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie", ["elements/animate", "managers/hook"], function () {

    var rootTimeline = (function () {

        var play,
            gotoFrame

        return {
            "isMock": true,
            "play": function () {
                play = true;
            },
            "stop": function () {
                play = false;
            },
            "gotoAndPlay": function (frame) {
                gotoFrame = frame;
            },
            "enact": function () {
                if (play !== undefined) {

                    if (play) {
                        X.movie.play();
                    } else {
                        X.movie.stop();
                    }

                }

                if (gotoFrame !== undefined) {
                    X.movie.gotoAndPlay(gotoFrame);
                }
            }
        }
    }());

    X.movie = {
        "changeCallback": new X.classes.Callback(),
        "play": function () {
            rootTimeline.play();
            X.movie.changeCallback.sendToCallback("play");
        },
        "stop": function (reason) {
            rootTimeline.stop(reason);
            X.movie.changeCallback.sendToCallback("stop", reason);
        },
        "gotoAndPlay": function (frame) {
            rootTimeline.gotoAndPlay(frame);
            rootTimeline.play();
        },
        "isPaused": function () {
            return rootTimeline.paused;
        },

        "getLabels": function () {
            if (rootTimeline.labels) {
                return rootTimeline.labels
            }
            return [];
        },

        ///////////////////////////////////////////////////////////////////////
        /////////////// Get root timeline
        ///////////////////////////////////////////////////////////////////////
        "_setRootTimeline": function (timeline) {

            var oldTimeline = rootTimeline;
            rootTimeline = timeline;

            if (oldTimeline.isMock) {
                oldTimeline.enact();
            }

            X.movie.pause.setRootTimeline(timeline);

        }
    };

    X.animate.callWhenLoaded(function () {

        if (rootTimeline.isMock && X.movie.rootTimeline) {
            X.movie.rootTimeline.set(X.animate.mainTimeline);
        }

    });

});