/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/linkNameToLibrarySymbol", ["managers/preferences", "elements/slideObject", "managers/movie", "elements/animate"], function () {

    X.preferences.define({
        "name":"linkNameToLibrarySymbol",
        "animateRequired": true,
        "method":function (value) {

            if (isInvalid(value)) {
                return;
            }

            var name = getSlideObjectClassName();

            if (!name) {
                X.log("Could not find a symbol by the name of '" + getSlideObjectClassName() +
                      "'. Perhaps this animation is only included to preload other animations?");

                return;
            }

            X.movie.rootTimeline.set(name);

        },
        "default":false
    });




    function isInvalid (value) {
        return !value || !X.slideObject
    }


    function getSlideObjectClassName () {

        var name = X.slideObject.name;

        if (X.animate.library[name]) {

            return name;

        }

        // If we're here, we haven't found the correct name
        // Let's try seeing if there's an underscore at the end of the name
        var underscore = name.lastIndexOf("_");

        if (underscore > 0) {

            name = name.substring(0, underscore);

        }

        if (X.animate.library[name]) {

            // If this is not valid, the function we are returning this to will pick it up.
            return name;

        }

        return false;

    }

});