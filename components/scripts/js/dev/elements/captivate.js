/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:56 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/captivate", ["managers/debugging/errors"], function () {

    X.captivate = {
        "isLoaded":function () {
            return window.parent.hasOwnProperty("cp");
        },
        "hasCpExtra": function () {
            if (X.captivate.window) {
                return X.captivate.window.hasOwnProperty("_extra");
            }
            return false;
        },
        "window":null,
        "base": null,
        "extra": null
    };

    if (X.captivate.isLoaded) {

        X.captivate.window = window.parent;
        X.captivate.base   = X.captivate.window.cp;
        X.captivate.alert  = X.captivate.window.alert;

    }

});