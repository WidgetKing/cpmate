/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/runInCaptivateWindow", ["elements/captivate"], function () {

    "use strict";

    X.runInCaptivateWindow = function (code) {

        if (X.captivate.isLoaded()) {

            X.captivate.window.eval(code);

        }

    }

});