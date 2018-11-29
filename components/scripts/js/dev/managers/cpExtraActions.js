/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:49 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/cpExtraActions", ["elements/captivate", "elements/slideObject"], function () {

    "use strict";

    var cpExtraActions = {};

    function init () {
        createCpExtraActionsArchitecture();

        // If neither captivate or CpExtra has been loaded, then do not continue.
        if (!X.captivate || !X.captivate.extra) {

            return;

        }

        registerWithCpExtra();
    }

    function createCpExtraActionsArchitecture () {

        X.cpExtraActions = {
            "register": function (actionName, method) {

                cpExtraActions[actionName] = method;

            },
            "unload": function () {
                X.captivate.extra.cpMate.deregister(X.slideObject.name, cpExtraBroadcastReceiver);
                X.captivate.extra.cpMate.deregister("*", cpExtraBroadcastReceiver);
            }
        };

    }


    function registerWithCpExtra () {

        X.captivate.extra.cpMate.register(X.slideObject.name, cpExtraBroadcastReceiver);
        X.captivate.extra.cpMate.register("*", cpExtraBroadcastReceiver);

    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Receiver
    ///////////////////////////////////////////////////////////////////////

    function cpExtraBroadcastReceiver (data) {

        if (!data.action || !data.parameters) {
            X.error("When broadcasting an action to CpMate an action or parameter was not defined");
            return;
        }

        if (!cpExtraActions.hasOwnProperty(data.action)) {
            X.error("Tried to enact CpMate action '" + data.action + "'. However, no such action was defined in CpMate.");
            return;
        }

        cpExtraActions[data.action].apply(null, data.parameters);

    }

    init();




});