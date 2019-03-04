X.registerModule("managers/cpVariablesManager", ["managers/utils", "elements/captivate"], function () {

  /////////////////////////////
  ////////// Variables
  var hasCpExtra = X.captivate.hasCpExtra();
  var fakeVariables = new X.classes.CallbackObject();


  X.cpVariablesManager = {

    "listenForVariableChange": (hasCpExtra) ? X.captivate.extra.variableManager.listenForVariableChange
                                              : fakeVariables.callback,

    "setVariableValue": (hasCpExtra) ? X.captivate.extra.variableManager.setVariableValue
                                       : fakeVariables.setProp,

    "getVariableValue": (hasCpExtra) ? X.captivate.extra.variableManager.getVariableValue
                                       : fakeVariables.getProp,

    "hasVariable": (hasCpExtra) ? X.captivate.extra.variableManager.getVariableValue
                                  : fakeVariables.hasProp
                                  
  }

});
