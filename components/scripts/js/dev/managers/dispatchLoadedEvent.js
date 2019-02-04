/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:58 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/dispatchLoadedEvent", function () {

    "use strict";

    var CPMATE_LOADED = "cpmateLoaded";

    function createEvent (name) {

        var event;

        if (typeof(Event) === 'function') {

            event = new Event(name);

        } else{

            event = document.createEvent('Event');
            event.initEvent(name, true, true);

        }

        return event

    }

    return function () {

        window.dispatchEvent(createEvent(CPMATE_LOADED));

    };

});