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
        var that = this;

        function validateDataIndex (index) {

            if (!that.data[index]) {

                that.data[index] = {
                    "overwritable": null,
                    "regular": []
                };

            }

        }

        this.addCallback = function (index, callback, overwritable) {

            // If this is the first callback we're adding.
            validateDataIndex(index);

            if (overwritable) {
                that.data[index].overwritable = callback;
            } else {
                that.data[index].regular.push(callback);
            }
        };

        that.addCallbackToFront = function (index, callback) {
            // If this is the first callback we're adding.
            validateDataIndex(index);

            that.data[index].regular.unshift(callback);
        };

        this.hasCallbackFor = function (index) {
            return that.data[index] !== undefined;
        };

        this.sendToCallback = function (index,parameter) {
            var returnValue,
                tempReturnValue,
                data = that.data[index];

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

            for (var index in that.data) {
                if (that.data.hasOwnProperty(index)) {

                    if (that.data[index].overwritable) {
                        method(index, that.data[index].overwritable);
                    }

                    a = that.data[index].regular;
                    for (var i = 0; i < a.length; i += 1) {
                        method(index,a[i]);
                    }

                }
            }
        };

        this.removeCallback = function (index, callbackToRemove) {

            var data = that.data[index];

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
                            delete that.data[index];
                        }
                        break;
                    }

                }
            }
        };

        this.removeIndex = function(index) {
            delete that.data[index];
        };

        this.clear = function () {
            that.data = {};
        };

    });
}, "class");
