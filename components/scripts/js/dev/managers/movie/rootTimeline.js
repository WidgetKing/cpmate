/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/29/18
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/rootTimeline", ["managers/movie"], function () {

    "use strict";

    X.movie.rootTimeline = {

        "set":function (symbolName) {

            if (!X.animate || !X.animate.library) {
                console.log("Tried to set root timeline before animate loaded");
                return;
            }

            if (typeof symbolName !== "string") {

                // We're not processing a symbol name, we're processing a full timeline
                X.movie._setRootTimeline(symbolName);
                return;

            }

            if (!X.animate.library.hasOwnProperty(symbolName)) {
                X.error("Could not find symbol with name " + symbolName +
                        " in library. Therefore was unable to add it as root timeline.");

                return;
            }

            var instance = new X.animate.library[symbolName]();
            X.animate.mainTimeline.addChild(instance);
            X.movie._setRootTimeline(instance);


        }

    };

});