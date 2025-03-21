X.registerModule(
  "managers/cpVariablesManager",
  [
    "managers/utils",
    "managers/hook",
    "elements/captivate",
    "managers/cpExtraActions"
  ],
  function () {
    /////////////////////////////
    ////////// Variables
    var hasCpExtra = X.captivate.hasCpExtra();
    var fakeVariables = new X.classes.CallbackObject();

    X.cpVariablesManager = {
      listenForVariableChange: hasCpExtra
        ? X.captivate.extra.variableManager.listenForVariableChange
        : fakeVariables.callback,

      setVariableValue: hasCpExtra
        ? X.captivate.extra.variableManager.setVariableValue
        : fakeVariables.setProp,

      getVariableValue: hasCpExtra
        ? X.captivate.extra.variableManager.getVariableValue
        : fakeVariables.getProp,

      hasVariable: hasCpExtra
        ? X.captivate.extra.variableManager.hasVariable
        : fakeVariables.hasProp,

      stopListeningForVariableChange: hasCpExtra
        ? X.captivate.extra.variableManager.stopListeningForVariableChange
        : fakeVariables.removeCallback
    };

    /////////////////////////////////////////
    ///////////////// UNLOAD
    //
    //
    // We want to make sure we unload all the variable listeners when the iframe
    // is unloaded. This is so that we don't get an error where CpExtra
    // calls code in an already unloaded iFrame
    var listenerList = {};

    // So first we need to spy on all the listeners being added and record them
    // in a list
    X.addHook(X.cpVariablesManager, "listenForVariableChange", function (
      key,
      value
    ) {
      if (!listenerList[key]) {
        listenerList[key] = [];
      }
      listenerList[key].push(value);
    });

    // Then when we are informed of the movie unload we will
    // loop through the list and unload all the listeners.
    X.broadcast.addCallback("unload", function () {
      X.utils.forEach(listenerList, function (key, list) {
        list.forEach(function (callback) {
          X.cpVariablesManager.stopListeningForVariableChange(key, callback);
        });
      });

      // Reset
      listenerList = {};
    });
  }
);
