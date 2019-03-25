/**
 *
 * @module X.slider.evaluate()
 *
 * Handles the settings we pass for when to evaluate a component (such as a slider)
 *
 * Expected settings include the following:
 *
 *
 * @param {Object} data - (required) A JSON object which provides the settings
 * @param {string} data.on - (required) The circumstance under which the evaluation should occur. Valid values include 'continually', 'mouse up', or 'button'.
 * @param {MovieClip} data.button - If data.on is set to 'button', we use this property to define which movie clip will act as a button. When that movie clip is clicked, evaluation will be triggered
 * @param {Array} data.criteria - (required) an array of the different situations and what to do in them. For more info see the criteria module.
 *
 * @example
 * X.slider({
 *	"track": this.track,
 *	"handle": this.handle,
 *	"variable": "myvar",
 *	"evaluate":{
 *		"on": "button",
 *		"button": this.submitbutton,
 *		"criteria":[
 *			{
 *				"if":"default",
 *				"then":"HAN_default_action" // Name of interactive object in Captivate whose success action we'll use
 *			},
 *			{
 *				"if": "10-15, 21, 30-60",
 *				"then": function () {
 *					some_variable = true;
 *					return "HAN_success_action" // This action will be called
 *				}
 *			},
 *			{
 *				"if": 20,
 *				"then": false // Do nothing
 *			}
 *		]
 *	}
 * });
 */ 
X.registerModule("managers/components/slider/evaluate", ["managers/mouseEvents", "managers/utils", "managers/components/slider/validator"], function () {
	
	X.slider.evaluate = function (data, variableName) {

		////////////////////////////////////////
		////////// setup
		////////////////////////////////////////

		////////////////////////////////////////
		////// variables
		var criteriaEvaluateMethods = [];
		var defaultEvaluateMethod;
		var matchMaker = function (term) {

			return function () {
				if (!data.on) return false;
				return data.on.toLowerCase() === term;
			}

		};
		var onContinually = matchMaker("continually");
		var onMouseUp = matchMaker("mouseup");
		var onButton = matchMaker("button");
		var onContinuallyAndMouseUp = X.utils.either(onContinually, onMouseUp);
		
		
		////////////////////////////////////////
		////// methods
		
		function getVariable () {

			return X.cpVariablesManager.getVariableValue(variableName);

		}

		function callThen (then) {

			switch (typeof then) {

				case "function" :
					then();
					break;
					
				case "string" :
					if (X.captivate.hasCpExtra()) {
						X.captivate.extraCallActionOn(then)
					}
					break;

			}

		}
		

		////////////////////////////////////////
		////////// entry point
		////////////////////////////////////////
		
		var init = X.utils.when(isValid, function () {

			breakUpCommaDelimitedEvaluationMethods();
			associateCriteriaWithEvaluationMethod();
			listenForButton();

		});

		////////////////////////////////////////
		////// error checking
		
		function isValid () {

			if (!data.on) {
			
				X.error("CO003", "on");
				return false;

			}

			if (!data.criteria) {
			
				X.error("CO003", "criteria");
				return false;
			
			}
			
			return true;

		}

		////////////////////////////////////////
		////// break up comma delimited evaluation methods

		// This is for those cases where someone specifies a comma
		// delimited list of 'if' conditions like:
		// "criteria"[
		// 	{
		// 		"if": "1, 20, 45",
		// 		"then": "HAN_something"
		// 	}
		// 	]
		//
		// 	Under those circumstances we will break up the 'if' list
		// 	and create a criteria object for each of the specified 
		// 	conditions.
		//
		// 	So the end result will look like:
		// "criteria"[
		// 	{
		// 		"if": "1",
		// 		"then": "HAN_something"
		// 	},
		// 	{
		// 		"if": "20",
		// 		"then": "HAN_something"
		// 	},
		// 	{
		// 		"if": "45",
		// 		"then": "HAN_something"
		// 	}
		// 	]

		function breakUpCommaDelimitedEvaluationMethods () {

			var finalCriteriaList = [];

			X.utils.forEach(data.criteria, function (criteriaData) {
					
				var conditionList = getConditionsList(criteriaData.if);

				// If there is no list of conditions
				if (!conditionList.length || conditionList.length === 1) {
				
					finalCriteriaList.push(criteriaData);
				
				} else {
					// If there is a list of conditions
					var newCriteria = makeCriteriaForEachCondition(conditionList, criteriaData.then);

					finalCriteriaList = finalCriteriaList.concat(newCriteria);

				}

			}); 

		
			data.criteria = finalCriteriaList;

		}

		var getConditionsList = X.utils.when(

				// Is this a string?
				X.utils.isType("string"),

				// It's a string
				X.utils.pipe(
					X.utils.removeWhiteSpace,
					X.utils.split(",")
				)
			
			);

		function makeCriteriaForEachCondition (list, then) {

			return X.utils.map(function (condition) {

				return {
					"if": condition,
					"then":then
				}

			}, list);

		}

		////////////////////////////////////////
		////// format criteria data
		
		function associateCriteriaWithEvaluationMethod () {

			// Loop through all the criteria
			X.utils.forEach(data.criteria, function (criteriaData) {

				// Before starting though, we have to check if this is
				// the default
				if (criteriaData.if === "default") {
				
					defaultEvaluateMethod = criteriaData.then;

					// We don't want to continue
					return;
				}
				// Find build a method that will check if the criteria matches
				var matchesCriteria = getCriteriaValidMethod(criteriaData.if);

				// If no valid value, then we'll STOP HERE
				if(!matchesCriteria) return;

				// Add the evaluate method
				criteriaEvaluateMethods.push(function (value) {

					// If the criteria matches...
					if (matchesCriteria(value)) {
						// We'll call the THEN method and we win!!!!!
						callThen(criteriaData.then);

						return true;
					}

					// We'll need to track whether the criteria matches or not if we are going to
					// get the 'default' method to work
					return false;

				})

			})

		}
		
		function getCriteriaValidMethod (circumstance) {

			// Loop through the list of evalation methods that have been defined
			// in other code files
			return X.utils.forEachUntilResult(function (evaluateMethodData) {

				// If this method can process this condition
				if (evaluateMethodData.isValid(circumstance)) {
				
					// then we'll create a method which runs the circumstance
					// and latest variable value 
					return function (value) {

						return evaluateMethodData.method(circumstance, value);

					}
				
				}

			}, X.slider.evaluateMethods);

		}
		
		////////////////////////////////////////
		////// handle button

		function listenForButton () {

			if (onButton() && data.button) {
			
				data.button.addEventListener(X.events.getSafeEvent("click"), evaluate);
			
			}

		}
		

		////////////////////////////////////////
		////// evaluate
		function evaluate () {

			var value = getVariable();
			var hadSuccessfulEvaluate = false;

			X.utils.forEach(criteriaEvaluateMethods, function (evaluateMethod) {

				var result = evaluateMethod(value);

				if (result) {
					hadSuccessfulEvaluate = true;
				}

			});

			if (!hadSuccessfulEvaluate && defaultEvaluateMethod) {
				callThen(defaultEvaluateMethod);
			}

		}
		
		
		////////////////////////////////////////
		////// kick off entry point
		init();


		////////////////////////////////////////
		////// exports

		return {
			"dragMove": X.utils.when(onContinually, evaluate),
			// In theory the line above does the same as the function below
			// However, in unit tests the line above only works 50% of the time
			// while the line below works 100% of the time.
			// "dragMove": function () {

			// 	if (onContinually()) {
				
			// 		evaluate();
				
			// 	}

			// },

			"dragEnd": X.utils.when(onContinuallyAndMouseUp, evaluate)
			// "dragEnd": function () {

			// 	if (onContinuallyAndMouseUp()) {
				
			// 		evaluate();
				
			// 	}

			// }
		}
		
	}

});
