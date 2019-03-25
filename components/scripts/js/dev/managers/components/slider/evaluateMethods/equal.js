X.registerModule("managers/components/slider/evaluateMethods/equal", ["managers/components/slider/registerEvaluateMethod"], function () {
	
	X.slider.registerEvaluateMethod("equals", {
		
		"isValid": X.utils.complement(isNaN),

		"method": function (condition, value) {

			var conditionNum = parseInt(condition);
			var valueNum = parseInt(value);

			return conditionNum === valueNum;

		}
	
	});

});
