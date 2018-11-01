/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/disableIFrameBorder", ["managers/preferences", "elements/slideObject"], function () {

    X.preferences.define({
        "name":"disableIFrameBorder",
        "method":function (value) {

            if (!X.captivate.isLoaded()) {
                return;
            }

            if (value) {

                disableBorder();

            } else {

                enableBorder();

            }

        },
        "default":true
    });

    function disableBorder () {
        X.slideObject.div.style.border = "0px";
    }

    function enableBorder () {
        X.slideObject.div.style.border = "1px";
    }
});