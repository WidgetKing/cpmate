/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:56 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/captivate", ["managers/debugging/logging"], function () {

    var MINIMUM_CP_EXTRA_VERSION = "1.4.2";

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

    function getCaptivateElements () {

        if (X.captivate.isLoaded()) {

            X.captivate.window = window.parent;
            X.captivate.base   = X.captivate.window.cp;
            X.captivate.alert  = X.captivate.window.alert;

            if (X.captivate.hasCpExtra()) {

                X.captivate.extra = {};
                getCpExtraElements();

            } else {
                X.error("GE001");
            }

        }
    }

    function getCpExtraElements () {

        X.captivate.extra = X.captivate.window._extra;
        X.captivate.extraPublicInterface = X.captivate.window.X;
        X.captivate.extraVersion = X.captivate.extraPublicInterface.version;

        if (X.captivate.extraVersion < MINIMUM_CP_EXTRA_VERSION) {
            X.error("GE002", X.captivate.extraVersion, MINIMUM_CP_EXTRA_VERSION);
        }

    }

    getCaptivateElements();

});