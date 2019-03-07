X.registerModule("managers/components/slider/model", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.model = function (initialData) {

    /////////////////////////////
    ////////// private variables
    var updateView;
    var cpVarName = initialData.variable;

    /////////////////////////////
    ////////// entry point
      function init() {

		handleNoCpExtra();

        if (!isValid()) return;

        X.cpVariablesManager.listenForVariableChange(cpVarName, variableUpdate);

      }

	  function handleNoCpExtra() {
		if (!X.captivate.hasCpExtra()) {
			// If CpExtra is not loaded, we'll create a fake version of the variable
			// and set its default value to the minimum value.
			X.cpVariablesManager.setVariableValue(cpVarName, initialData.min);
		}
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

	
	
	
	
	
	/////////////////////////////////
	/////////////// EXPORTS
	
    return {
      "updateTo": function (method) {
          updateView = method;
      },
	  "dragStart": function (x, y) {

	  }, 
	  "dragMove": function (x, y) {

	  },
	  "dragEnd": function () {

	  }
    };
  }

});
