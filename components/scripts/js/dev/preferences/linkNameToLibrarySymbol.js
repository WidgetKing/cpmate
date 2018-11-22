/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/linkNameToLibrarySymbol", ["managers/preferences", "elements/slideObject", "managers/movie"], function () {

    X.preferences.define({
        "name":"linkNameToLibrarySymbol",
        "animateRequired": true,
        "method":function (value) {

            if (isInvalid(value)) {
                return;
            }

            var libraryInstance = getLibraryInstance();

            if (!libraryInstance) {
                X.log("Could not find a symbol by the name of '" + getSlideObjectClassName() +
                      "'. Perhaps this animation is only included to preload other animations?");

                return;
            }

            addToStage(libraryInstance);
            X.movie.setRootTimeline(libraryInstance);

        },
        "default":false
    });




    function isInvalid (value) {
        return !value || !X.slideObject
    }

    function getLibraryInstance () {
        var name = getSlideObjectClassName(),
            SymbolClass = X.animate.library[name];

        if (SymbolClass) {
            return new SymbolClass();
        }
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

        // If this is not valid, the function we are returning this to will pick it up.
        return name;
    }

    function addToStage (instance) {
        X.animate.mainTimeline.addChild(instance);
    }

});