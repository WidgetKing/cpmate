X.registerModule("managers/components/slider/model", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.model = function (initialData) {

    /////////////////////////////
    ////////// private variables
    var updateView;
    var cpVarName = initialData.variable;

    /////////////////////////////
    ////////// entry point
      function init() {
        if (!isValid()) return;

        X.cpVariablesManager.listenForVariableChange(cpVarName, variableUpdate);
      }

      function isValid() {
        if (!X.cpVariablesManager.hasVariable(cpVarName)) {

          X.error("CO002", cpVarName);

          return false;
        }

        return true;
      }

      function variableUpdate() {
          value = X.cpVariablesManager.getVariableValue(cpVarName);
          updateView(value);
      }

      init();

    return {
      "updateTo": function (method) {
          updateView = method;
      }
    };
  }

});
