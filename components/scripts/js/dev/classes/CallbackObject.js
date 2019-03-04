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

        var callback = new X.classes.Callback();
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

    });

}, "class");
