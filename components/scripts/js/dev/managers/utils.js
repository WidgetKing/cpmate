/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 12:19 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/utils", function() {
  "use strict";

  function curry(numParams, method) {
    function mergeParams(oldParams, newParams) {
      var params = [];

      oldParams.forEach(function(param) {
        if (param === X.utils.__ && newParams.length > 0) {
          params.push(newParams.shift());
        } else {
          params.push(param);
        }
      });

      return params.concat(newParams);
    }

    function getTrueParamsLength(params) {
      return X.utils.reduce(
        function(value, acc) {
          if (value === X.utils.__) {
            return acc;
          } else {
            return acc + 1;
          }
        },
        0,
        params
      );
    }

    function innerCurry(params, args) {
      var argumentsArray = Array.prototype.slice.call(args);
      params = mergeParams(params, argumentsArray);

      if (getTrueParamsLength(params) >= numParams) {
        return method.apply(null, params);
      } else {
        return callInnerCurry(params);
      }
    }

    function callInnerCurry(params) {
      return function() {
        return innerCurry(params, arguments);
      };
    }

    return callInnerCurry([]);
  }

  X.utils = {
    isMobile: "ontouchstart" in document.documentElement,

    callIfDefined: function(method) {
      if (method) {
        var args = Array.prototype.slice.call(arguments);
        args = args.splice(1, args.length);

        return method.apply(null, args);
      }
    },

    onNextTick: function(func) {
      return function() {
        var args = arguments;

        if (!createjs || !createjs.Ticker) {
          return;
        }

        createjs.Ticker.on(
          "tick",
          function() {
            func.apply(null, args);
          },
          null,
          true
        );
      };
    },

    singleton: function(func) {
      var hasBeenCalled = false;

      return function() {
        if (!hasBeenCalled) {
          func.apply(null, arguments);
          hasBeenCalled = true;
        }
      };
    },

    hasSuffix: function(string, suffix) {
      var ending = string.substring(
        string.length - suffix.length,
        string.length
      );
      return ending === suffix;
    },

    callByType: function(parameter, methods) {
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

    isEmpty: function(parameter) {
      return X.utils.callByType(parameter, {
        object: function(p) {
          return Object.keys(p).length <= 0;
        },

        array: function(p) {
          return p.length <= 0;
        }
      });
    },

    filter: function(sequence, condition) {
      var types = {
        array: function(array) {
          var newArray = [];

          array.forEach(function(element) {
            if (condition(element)) {
              newArray.push(element);
            }
          });

          return newArray;
        },

        object: function(object) {
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

        string: function(string) {
          var newString = "",
            letter;

          for (var i = 0; i < string.length; i += 1) {
            letter = string[i];

            if (condition(letter)) {
              newString += letter;
            }
          }

          return newString;
        }
      };

      return X.utils.callByType(sequence, types);
    },

    forEach: function(sequence, method) {
      X.utils.callByType(sequence, {
        array: function(array) {
          array.forEach(method);
        },

        object: function(object) {
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              method(key, object[key]);
            }
          }
        }
      });
    },

    forEachUntil: curry(3, function(predicate, loop, list) {
      return X.utils.callByType(list, {
        array: function() {
          for (var i = 0; i < list.length; i += 1) {
            var result = loop(list[i]);

            if (predicate(result)) {
              return result;
            }
          }
        },

        object: function() {
          for (var key in list) {
            if (list.hasOwnProperty(key)) {
              var result = loop(list[key]);

              if (predicate(result)) {
                return result;
              }
            }
          }
        }
      });
    }),

    forEachUntilResult: function(loop, list) {
      function predicate(value) {
        return value !== undefined;
      }

      return X.utils.forEachUntil(predicate, loop, list);
    },

    identity: function(value) {
      return value;
    },

    T: function() {
      return true;
    },

    F: function() {
      return false;
    },

    pipeLog: function(value) {
      console.log(value);

      return value;
    },

    any: curry(2, function(predicate, list) {
      return X.utils.pipe(
        X.utils.forEachUntil(X.utils.identity, predicate),
        X.utils.when(X.utils.isNil, X.utils.F)
      )(list);
    }),

    defaultTo: function(def, obj) {
      X.utils.forEach(def, function(key, value) {
        if (value !== null && typeof value === "object") {
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

    getMissingProps: function(props, obj) {
      var result = [];

      X.utils.forEach(props, function(value) {
        if (!obj.hasOwnProperty(value)) {
          result.push(value);
        }
      });

      return result;
    },

    // complement: function(method) {
    //   return function() {
    //     return !method.apply(null, arguments);
    //   };
    // },

    ifElse: function(predicate, trueF, falseF) {
      return function() {
        if (predicate.apply(null, arguments)) {
          return trueF.apply(null, arguments);
        } else {
          return falseF.apply(null, arguments);
        }
      };
    },

    when: function(predicate, method) {
      return X.utils.ifElse(predicate, method, X.utils.identity);
    },

    unless: function(predicate, method) {
      return X.utils.ifElse(predicate, X.utils.identity, method);
    },

    getPercent: function(min, max, value) {
      var range = max - min;
      var diffFromMin = value - min;
      return diffFromMin / range;
    },

    minMax: function(min, max, value) {
      value = Math.min(value, max);
      value = Math.max(value, min);
      return value;
    },

    calculatePercentInRange: function(min, max, percent) {
      var range = max - min;
      var value = range * percent;
      return value + min;
    },

    reduce: function(method, initialValue, list) {
      X.utils.forEach(list, function(value) {
        initialValue = method(value, initialValue);
      });

      return initialValue;
    },

    within: curry(3, function(start, end, value) {
      return value >= start && value <= end;
    }),

    both: function(predicateA, predicateB) {
      return function(value) {
        return predicateA(value) && predicateB(value);
      };
    },

    either: function(predicateA, predicateB) {
      return function(value) {
        return predicateA(value) || predicateB(value);
      };
    },

    map: curry(2, function(method, data) {
      return X.utils.callByType(data, {
        array: function() {
          var returnArray = [];

          X.utils.forEach(data, function(item) {
            var result = method(item);
            returnArray.push(result);
          });

          return returnArray;
        },

        object: function() {
          var returnObject = {};

          X.utils.forEach(data, function(key, item) {
            var result = method(item);
            returnObject[key] = result;
          });

          return returnObject;
        }
      });
    }),

    __: {},

    curry: curry,

    pipe: function() {
      var argumentsArray = Array.prototype.slice.call(arguments);

      return function(input) {
        return X.utils.reduce(
          function(method, input) {
            return method(input);
          },
          input,
          argumentsArray
        );
      };
    },

    complement: function(method) {
      return function() {
        var result = method.apply(null, arguments);

        if (typeof result === "function") {
          return X.utils.complement(result);
        } else {
          return !result;
        }
      };
    },

    removeWhiteSpace: function(string) {
      if (typeof string === "string") {
        return string.replace(/\s/g, "");
      }
    },

    split: curry(2, function(character, string) {
      if (character && string) {
        return string.split(character);
      }
    }),

    isType: curry(2, function(type, data) {
      return typeof data === type;
    }),

    isNil: function(value) {
      return (
        value === "" ||
        value === null ||
        value === undefined ||
        (isNaN(value) && typeof value === "number")
      );
    },

    isNotNil: function(value) {
      return !X.utils.isNil(value);
    },

    invert: function(value) {
      return !value;
    },

    isIndexEmpty: curry(2, function(index, array) {
      return X.utils.isNil(array[index]);
    }),

    isRange: function(string) {
      return X.utils.pipe(
        X.utils.getRangeObject,
        X.utils.isNil,
        X.utils.invert
      )(string);
    },

    getRangeObject: function(string) {
      return X.utils.pipe(
        X.utils.removeWhiteSpace,

        X.utils.split("-"),

        X.utils.map(parseInt),

        function(rangeArray) {
          var isMinus = X.utils.isIndexEmpty(X.utils.__, rangeArray);

          switch (rangeArray.length) {
            // case 2:
            // This is not needed.
            // It's just here so that default
            // won't stop the function
            // break;

            case 3:
              if (isMinus(0)) {
                rangeArray = [rangeArray[1] * -1, rangeArray[2]];
              } else if (isMinus(1)) {
                rangeArray = [rangeArray[0], rangeArray[2] * -1];
              } else {
                rangeArray = null;
              }

              break;

            case 4:
              if (isMinus(0) && isMinus(2)) {
                rangeArray = [rangeArray[1] * -1, rangeArray[3] * -1];
              }

              break;
          }

          if (rangeArray === null) return [NaN];

          return {
            start: rangeArray[0],
            end: rangeArray[1]
          };
        },

        X.utils.when(X.utils.any(X.utils.isNil), X.utils.always(null))
      )(string);
    },

    always: function(value) {
      return function() {
        return value;
      };
    },

    tap: curry(2, function(method, value) {
      method(value);
      return value;
    }),

    allPass: curry(2, function(predicateList, input) {
      for (var i = 0; i < predicateList.length; i += 1) {
        if (!predicateList[i](input)) return false;
      }

      return true;
    }),

    prop: curry(2, function(property, object) {
      return object[property];
    }),

    propEq: curry(3, function(property, value, object) {
      return object[property] === value;
    }),

    has: curry(2, function(property, object) {
      return X.utils.callByType(object, {
        // OBJECT
        object: function(obj) {
          return obj.hasOwnProperty(property);
        },

        // ARRAY
        array: function() {
          // loop
          for (var i = 0; i < object.length; i += 1) {
            // Is this item identical?
            if (object[i] === property) {
              return true;
            }
          }
          return false;
        }
      });
    }),

    hasnt: curry(2, function(property, object) {
      return !X.utils.has(property, object);
    })
  };
});
