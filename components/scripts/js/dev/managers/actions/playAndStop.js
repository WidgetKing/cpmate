/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/playAndStop", ["managers/cpExtraActions"], function () {

    "use strict";

    if (!X.cpExtraActions) {
        return;
    }


    function registerAndCallWhenLoaded (name, method) {

        X.cpExtraActions.register(name, function () {

            // Make sure the animate runtime has already loaded.
            X.animate.callWhenLoaded(function () {

                method();

            })

        });

    }

    registerAndCallWhenLoaded("movieResume", function () {

        if (X.movie.isPaused() &&
            X.movie.pause.reason === X.movie.pause.type.CAPTIVATE_PAUSED) {

            X.movie.play();

        }

    });

    registerAndCallWhenLoaded("moviePause", function () {

        if (!X.movie.isPaused()) {

            X.movie.stop(X.movie.pause.type.CAPTIVATE_PAUSED);

        }

    });



});
