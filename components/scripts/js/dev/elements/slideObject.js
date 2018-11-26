/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 10:25 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/slideObject", ["elements/captivate", "managers/broadcast"], function () {

    function recursiveParentSearch (tag, property, value) {

        while (tag.parentElement) {

            if (tag.getAttribute(property) === value) {
                return tag;
            } else {
                tag = tag.parentElement;
            }
        }

        return null;

    }

    if (X.captivate.isLoaded()) {

        X.slideObject = {};
        X.slideObject.iframe = window.frameElement;
        X.slideObject.div = recursiveParentSearch(X.slideObject.iframe, "class", "cp-WebObject");
        X.slideObject.name = X.slideObject.div.getAttribute("id");
        // Remove the 'c' from end of name
        // Eg. change 'Web_1c' to 'Web_1';
        X.slideObject.name = X.slideObject.name.substring(0, X.slideObject.name.length - 1);

        if (X.captivate.extra) {
            X.slideObject.proxy = X.captivate.extra.slideObjects.getSlideObjectByName(X.slideObject.name);
        }

    }

    X.broadcast.addCallback("unload", function () {
        if (X.slideObject) {
            delete X.slideObject.proxy;
        }
    });

});