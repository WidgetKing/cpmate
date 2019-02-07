/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/runInCaptivateWindow", ["elements/captivate"], function () {

    "use strict";

    /**
     * Accepts a function to be run in the Captivate window context.
     * In order to avoid duplicating execution of code due to the
     * CpMate window being loaded multiple times, the ID parameter
     * is provided.
     * CpExtra will keep track of the code and the IDs, making sure
     * that once code associated with one ID has run, the next time
     * X.runInCaptivateWindow is called with that ID, that code will
     * NOT run.
     * @param func
     * @param id
     */
    X.runInCaptivateWindow = function (func, id) {

        if (X.captivate.extra) {

            var code = "(" + func.toString() + "())";

            if (code) {

                X.captivate.extra.safeEval(code, id);

            }

        }

    };

});