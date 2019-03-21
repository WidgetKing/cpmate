X.registerModule("managers/prefix/displayObjectNameAndVariable", ["managers/prefix/displayObjectName"], function () {
	
	///////// UTIL	
	function getVariableName (name) {

		// xfoobar, my, var, name
		var nameSplit = name.split("_");
		// my, var, name
		var nameSplitMinusStart = nameSplit.splice(1, nameSplit.length -1);

		createVariableIfNotInCaptivate(nameSplitMinusStart);
		
		var validVarName = loopThroughVarNames(nameSplitMinusStart);

		if (validVarName) {
		
			return validVarName;

		} else {
		
			X.error("PR001", name);
		
		}

	}

	function createVariableIfNotInCaptivate (nameSections) {

  		if (!X.captivate.hasCpExtra()) {
			
			var varName = buildVariableNameFromArray(nameSections);
			X.cpVariablesManager.setVariableValue(varName, "");

		}

	}
	
	
	function loopThroughVarNames (nameSections) {

		var name;
		var i = nameSections.length -1;
		var workingSections;
		var splicedSections;
		var almostVariableName;
		var variableName;

		while(i >= 0) {
		
			workingSections = nameSections.concat();
			splicedSections = workingSections.splice(0, i+1);
			variableName = buildVariableNameFromArray(splicedSections);

			if (X.cpVariablesManager.hasVariable(variableName)) {
				return variableName;
			}

			i--;
		}
		
		return null;

	}
	
	function buildVariableNameFromArray (varNameArray) {

		var almostVariableName = X.utils.reduce(makeVariableName, "", varNameArray);
		return almostVariableName.substring(1, almostVariableName.length);

	}
	

	function makeVariableName (value, acc) {

		return acc + "_" + value;

	}
	


	///////// ENTRY POINT
	X.registerDisplayObjectNamePrefixAndVariable = function (prefix, callback) {

		// Get informed when a movieClip matching our prefix appears
		X.registerDisplayObjectNamePrefix(prefix, function (movieClip) {


			/////////// ASSISTANT METHODS
			function updateCallback (value) {

				// Inform the originally passed in callback
				callback(movieClip, value);

			}
			
			
			
			// Interpret variable name from movie clip name
			var variableName = getVariableName(movieClip.name);

			// If we can't find variable then stop here
			if (!variableName) return;

			// listen for variable change
			X.cpVariablesManager.listenForVariableChange(variableName, updateCallback);

			// Update the callback now with the current variable value
			var currentValue = X.cpVariablesManager.getVariableValue(variableName);

			updateCallback(currentValue);

		})

	}

});
