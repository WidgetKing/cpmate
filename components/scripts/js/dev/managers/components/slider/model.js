X.registerModule("managers/components/slider/model", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.model = function (initialData) {

    /////////////////////////////
    ////////// private variables
    var updateView;
    var cpVarName = initialData.variable;
	var mouseHandleOffsetX = 0;
	var mouseHandleOffestY = 0;
	var data = {
		dragStartX:0,
		dragStartY:0,
		dragCurrentX:0,
		dragCurrentY:0
	}

    /////////////////////////////
    ////////// util functions
	function updateAfter(method) {
		return function () {
			method.apply(null, arguments);
			updateView(data);
		}
	}
	
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
          var value = X.cpVariablesManager.getVariableValue(cpVarName);
      }

      init();

	
	
	
	
	
	/////////////////////////////////
	/////////////// EXPORTS
	
    return {
      "updateTo": function (method) {
          updateView = method;
      },
	  "dragStart": function (x, y) {
		  data.dragStartX = x;
		  data.dragStartY = y;
	  }, 
	  "dragMove": updateAfter(function (x, y) {
		  data.dragCurrentX = x;
		  data.dragCurrentY = y;
	  }),
	  "dragEnd": function () {

	  }
    };
  }

});
