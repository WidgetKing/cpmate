X.registerModule("managers/components/slider/model", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.model = function (initialData) {

    /////////////////////////////
    ////////// private variables
    var updateView;
    var cpVarName = initialData.variable;
	var isCurrentlyDragging = false;
	var isVertical = initialData.orientation === "vertical";
	var mouseHandleOffset = 0;
	var data = {
		handlePosition: 0
	}
	var handle = new X.classes.DisplayObjectProxy(initialData.handle);
	var track = new X.classes.DisplayObjectProxy(initialData.track);

	if (isVertical) {
		handle.primary = "y";
		track.primary = "y";
	} else {
		handle.primary = "x";
		track.primary = "x";
	}

	var topLimit = track.primaryAxis + track.primaryLength - handle.primaryLength
	var bottomLimit = track.primaryAxis;







    /////////////////////////////
    ////////// util functions
	function updateAfter(method) {
		return function () {
			method.apply(null, arguments);
			updateView(data);
		}
	}
	


	/////////////////////////////////
	/////////////// VARIABLE UPDATE
	
	  var variableUpdate = X.utils.unless(
		  // predicate
		  function () { return isCurrentlyDragging },
		  // method
		  updateAfter(
			  function () {

				  var value = X.cpVariablesManager.getVariableValue(cpVarName);
				  data.handlePosition = transposeVariableValueToHandlePosition(value);
			  }
		  )
		  );


	function transposeVariableValueToHandlePosition(value) {
		var percent = X.utils.getPercent(initialData.min, initialData.max, value);
		var minMaxedPercent = X.utils.minMax(0, 1, percent);
		return X.utils.calculatePercentInRange(bottomLimit, topLimit, minMaxedPercent);
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


      init();
	
	/////////////////////////////////
	/////////////// EXPORTS HELPERS
	
	function calculateHandleMove(loc) {

		loc = loc - mouseHandleOffset;
		loc = Math.min(loc, topLimit);
		loc = Math.max(loc, bottomLimit);
		return loc;	
		
	}
	
	function updateCaptivateVariable(loc) {
		
		var percentage             = X.utils.getPercent(bottomLimit, topLimit, loc);
		var rawValue        = X.utils.calculatePercentInRange(initialData.min, initialData.max, percentage);
		var outputValue            = Math.round(rawValue);

		X.cpVariablesManager.setVariableValue(initialData.variable, outputValue);
		
	}
	
	/////////////////////////////////
	/////////////// EXPORTS
	
    return {
      "updateTo": function (method) {
          updateView = method;
      },
	  "dragStart": function (x, y) {
		  // We turn this on so if the Captivate Variable updates while we're dragging
		  // We do not update the handle to its value.
	  	  isCurrentlyDragging = true;

		  if (isVertical) {
			  mouseHandleOffset = y - handle.y;
		  } else {
			  mouseHandleOffset = x - handle.x;
		  }
	  }, 
	  "dragMove": updateAfter(function (x, y) {
		  
		  var axis;

		  if (isVertical) {
		  	 axis = y;
		  } else {
		  	 axis = x;
		  }
		  
		  var handlePosition = calculateHandleMove(axis);
		  updateCaptivateVariable(handlePosition);
		  data.handlePosition = handlePosition;

	  }),
	  "dragEnd": function () {
			// It is now safe for us to keep listening to the captivate variable update
			isCurrentlyDragging = false;
	  }
    };
  }

});
