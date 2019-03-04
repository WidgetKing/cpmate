/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 12:19 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/utils", function () {

    "use strict";

    X.utils = {

        "callIfDefined": function (method) {
            if (method) {
                var args = Array.prototype.slice.call(arguments);
                args = args.splice(1, args.length);

                return method.apply(null, args);
            }
        },

        "onNextTick": function (func) {
            return function () {

                var args = arguments;

                if (!createjs || !createjs.Ticker) {
                    return;
                }

                createjs.Ticker.on("tick", function () {
                    func.apply(null, args);
                }, null, true);

            };
        },

        "singleton": function (func) {
            var hasBeenCalled = false;

            return function () {

                if (!hasBeenCalled) {
                    func.apply(null, arguments);
                    hasBeenCalled = true;
                }

            }
        },

        "hasSuffix": function (string, suffix) {
            var ending = string.substring(string.length - suffix.length , string.length);
            return ending === suffix;
        },

        "callByType": function (parameter, methods) {

            switch (typeof parameter) {

                case "string":
                    return X.utils.callIfDefined(methods.string, parameter);

                case "number":
                    return X.utils.callIfDefined(methods.number, parameter);

                case "object":

                    if (parameter.constructor === Array) {
                        return X.utils.callIfDefined(methods.array, parameter);
                    } else {
                        return X.utils.callIfDefined(methods.object, parameter);
                    }

            }

        },


        "isEmpty": function (parameter) {
            return X.utils.callByType(parameter, {

                "object": function (p) {
                    return Object.keys(p).length <= 0;
                },

                "array": function (p) {
                    return p.length <= 0;
                }

            })
        },

        "filter": function (sequence, condition) {


            var types = {


                "array": function (array) {

                    var newArray = [];

                    array.forEach(function (element) {

                        if (condition(element)) {
                            newArray.push(element);
                        }

                    });

                    return newArray;

                },



                "object": function (object) {

                    var newObject = {};

                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {

                            if (condition(key, object[key])) {

                                newObject[key] = object[key];

                            }

                        }
                    }

                    return newObject;

                },



                "string": function (string) {

                    var newString = "",
                        letter;

                    for (var i = 0; i < string.length; i += 1) {

                        letter = string[i];

                        if (condition(letter)) {
                            newString += letter
                        }
                    }

                    return newString;

                }
            };



            return X.utils.callByType(sequence, types);

        },

        "forEach": function (sequence, method) {
            X.utils.callByType(sequence, {

                "array":function (array) {

                    array.forEach(method);

                },

                "object":function (object) {

                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {

                            method(key, object[key]);

                        }
                    }

                }

            });
        },

        "defaultTo": function (def, obj) {

            X.utils.forEach(def, function (key, value) {

                if (value !== null &&
                    typeof value === "object") {

                  var originalObj = obj[key];

                  if (!originalObj) {
                    originalObj = {};
                  }

                  obj[key] = X.utils.defaultTo(value, originalObj);

                } else if (!obj.hasOwnProperty(key)) {
                  obj[key] = value;
                }

            });

            return obj;

        },

        "getMissingProps": function (props, obj) {

          var result = [];

          X.utils.forEach(props, function (value) {

            if (!obj.hasOwnProperty(value)) {
              result.push(value);
            }

          });

            return result;
        }

    };

});
