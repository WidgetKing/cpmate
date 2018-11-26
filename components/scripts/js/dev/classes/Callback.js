/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("classes/Callback", ["managers/classes"], function () {

    "use strict";

    X.classes.register("Callback", function () {

        this.data = {};

        function validateDataIndex (index, that) {
            if (!that.data[index]) {

                that.data[index] = {
                    "overwritable": null,
                    "regular": []
                };

            }

        }

        this.addCallback = function (index, callback, overwritable) {

            // If this is the first callback we're adding.
            validateDataIndex(index, this);

            if (overwritable) {
                this.data[index].overwritable = callback;
            } else {
                this.data[index].regular.push(callback);
            }
        };

        this.addCallbackToFront = function (index, callback) {
            // If this is the first callback we're adding.
            validateDataIndex(index, this);

            this.data[index].regular.unshift(callback);
        };

        this.hasCallbackFor = function (index) {
            return this.data[index] !== undefined;
        };

        this.sendToCallback = function (index,parameter) {
            var returnValue,
                tempReturnValue,
                data = this.data[index];

            if (data) {

                // Trigger overwritable callback
                if (data.overwritable) {
                    data.overwritable(parameter);
                }

                // Trigger regular callbacks
                var a = data.regular;

                for (var i = 0; i < a.length; i += 1) {

                    // If the callback returns a value, then we'll return it at the end (assuming noting overrides it before then)
                    tempReturnValue = a[i](parameter);

                    if (tempReturnValue !== undefined) {
                        returnValue = tempReturnValue;
                    }

                }
            }

            return returnValue;
        };

        this.forEach = function (method) {

            var a;

            for (var index in this.data) {
                if (this.data.hasOwnProperty(index)) {

                    if (this.data[index].overwritable) {
                        method(index, this.data[index].overwritable);
                    }

                    a = this.data[index].regular;
                    for (var i = 0; i < a.length; i += 1) {
                        method(index,a[i]);
                    }

                }
            }
        };

        this.removeCallback = function (index, callbackToRemove) {

            var data = this.data[index];

            if (data) {

                // Check overwrite first
                if (data.overwritable && data.overwritable === callbackToRemove) {
                    delete data.overwritable;
                    return;
                }

                var a = data.regular,
                    registeredCallback;


                for (var i = 0; i < a.length; i += 1) {

                    registeredCallback = a[i];

                    if (callbackToRemove === registeredCallback) {
                        a.splice(i,1);

                        // If we have just deleted the last callback for this index, then we'll delete the array so that
                        // hasCallbackFor() will be able to respond accurately.
                        if (a.length <= 0) {
                            delete this.data[index];
                        }
                        break;
                    }

                }
            }
        };

        this.removeIndex = function(index) {
            delete this.data[index];
        };

        this.clear = function () {
            this.data = {};
        };

    });
}, "class");