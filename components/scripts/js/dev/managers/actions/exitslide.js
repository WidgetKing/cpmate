/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/exitslide", ["managers/cpExtraActions"], function () {

    "use strict";

    X.cpExtraActions.register("exitslide", function () {

        // Have yet to have a need to react to this event
        // Unloading is handled by the 'unload' cpExtraAction
        // However, we still have to define this, otherwise we will get an alert message
        // When CpExtra tries to call this action and nothing is defined for it.

    });

});