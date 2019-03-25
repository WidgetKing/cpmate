X.registerModule("managers/components/slider/evaluateMethods/range", ["managers/components/slider/registerEvaluateMethod"], function () {
	
	X.slider.registerEvaluateMethod("range", {

		"isValid": X.utils.isRange,

		"method": function (condition, value) {

			var range = X.utils.getRangeObject(condition);
			return X.utils.within(range.start, range.end, value);

		}
	});

});
