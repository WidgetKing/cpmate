describe("managers/components/slider/registerEvaluateMethod", function () {
	
	var mod = unitTests.requestModule("managers/components/slider/registerEvaluateMethod");
	
	beforeEach(function () {
		
		window.X = {
			"classes":unitTests.classes,
			"slider":{
			
			}
		};

		mod();

	});

	it("should defined X.slider.evaluateMethods", function () {

		expect(X.slider.evaluateMethods).toBeDefined();

	});

	it("should defined X.slider.registerEvaluateMethod", function () {

		expect(X.slider.registerEvaluateMethod).toBeDefined();

	});

	describe("X.slider.registerEvaluateMethod()", function () {
		
		it("should add an evaluateMethod to X.slider.evaluateMethods", function () {

			// 1: SETUP
			var data = {
				"isValid": () => true,
				"method": () => false
			}

			// 2: TEST
			X.slider.registerEvaluateMethod("foobar", data);

			// 3: ASSERT
			expect(X.slider.evaluateMethods.foobar).toEqual(data);

		});
		
	});

});
