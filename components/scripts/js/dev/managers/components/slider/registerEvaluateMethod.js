X.registerModule("managers/components/slider/registerEvaluateMethod", ["managers/components/slider/validator"], function () {
	
	X.slider.evaluateMethods = {};
	X.slider.registerEvaluateMethod = function (name, data) {

		X.slider.evaluateMethods[name] = data;

	}

});
