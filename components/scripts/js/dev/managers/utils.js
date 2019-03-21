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

      "isMobile": 'ontouchstart' in document.documentElement,

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

		"forEachUntil": function (predicate, loop, list) {

			for (var i = 0; i < list.length; i += 1) {

				var result = loop(list[i]);

				if (predicate(result)) {
					return result;
				}

			}

		},

		"forEachUntilResult": function (loop, list) {

			function predicate (value) {

				return value !== undefined;

			}
			

			return X.utils.forEachUntil(predicate, loop, list);

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
        },

		"ifElse": function (predicate, trueF, falseF) {
			
			return function () {
				if (predicate.apply(null, arguments)) {
					return trueF.apply(null, arguments);
				} else {
					return falseF.apply(null, arguments);
				}
			}

		},	

		"when": function (predicate, method) {
			
			return X.utils.ifElse(predicate, method, function () {
				// Just a dummy function
			});
		},

		
		"unless": function (predicate, method) {
			
			return X.utils.ifElse(predicate, function () {
				// Just a dummy function
			}, method);
		},

		"getPercent": function (min, max, value) {
			
			var range = max - min;
			var diffFromMin = value - min;
			return diffFromMin / range;

		},

		"minMax": function (min, max, value) {
			
			value = Math.min(value, max);
			value = Math.max(value, min);
			return value;

		},

		"calculatePercentInRange": function (min, max, percent) {
			
			var range = max - min;
			var value = range * percent;
			return value + min;

		},

		"reduce": function (method, initialValue, list) {

			X.utils.forEach(list, function(value) {

					initialValue = method(value, initialValue);

				}
			);

			return initialValue;

		},

		"both": function (predicateA, predicateB) {

			return function (value) {

				return predicateA(value) && predicateB(value);

			}

		},

		"either": function (predicateA, predicateB) {

			return function (value) {

				return predicateA(value) || predicateB(value);

			}

		}
    };

});
