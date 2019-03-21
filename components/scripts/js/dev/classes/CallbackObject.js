/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("classes/CallbackObject", ["managers/classes"], function () {

    "use strict";

    X.classes.register("CallbackObject", function () {

		var CallbackClass;

		// Yes, it's not good that we're making a reference to the unit tests
		// in the main code but... does this save a lot of time in bug hunting
		// do I tell you.
		if (window.X) {
			CallbackClass = X.classes.Callback;
		} else {
			CallbackClass = unitTests.classes.Callback;	
		}

        var callback = new CallbackClass();
        var obj = {};

        this.callback = callback.addCallback;

        /**
         * When a property is changed it will send a message to any
         * callbacks associated with that property.
         *
         * @param  {string} key the property to be changed
         * @param  {*} value the value for the property to be changed to
         */
        this.setProp = function (key, value) {

          obj[key] = value;

          callback.sendToCallback(key, value);
          callback.sendToCallback("*", value);

        }

        this.getProp = function (key) {
          return obj[key];
        }

        this.hasProp = function (key) {
          return obj.hasOwnProperty(key);
        }

		this.removeCallback = callback.removeCallback;

    });

}, "class");
