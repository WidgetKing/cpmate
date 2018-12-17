/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 10:41 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/pausingInstanceSuffix", ["managers/preferences", "managers/utils"], function () {

    "use strict";

    var list,
        init = X.utils.singleton(function () {

            X.movie.changeCallback.addCallback("play", function () {
                X.utils.forEach(list, function (key, element) {

                    element.play();

                });
            });

            X.movie.changeCallback.addCallback("stop", function () {
                X.utils.forEach(list, function (key, element) {

                    element.stop();

                });
            })

        });


    X.preferences.define({
        "name":"pausingInstanceSuffix",
        "animateRequired": true,
        "method":function (suffix) {

            init();

            function reactToNewList () {

                list = X.movie.children.getListMatchingSuffix(suffix);

            }

            if (X.movie.children.exist) {
                reactToNewList();
            }

            X.movie.children.changeCallback.addCallback("*", reactToNewList);

        }
    });

});