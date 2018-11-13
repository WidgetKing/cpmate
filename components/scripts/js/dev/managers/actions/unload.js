/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/unload", ["managers/cpExtraActions"], function () {

    "use strict";

    X.cpExtraActions.register("unload", function () {

        X.cpExtraActions.unload();

    });

});