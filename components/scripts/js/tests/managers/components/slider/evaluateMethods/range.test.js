fdescribe("managers/components/slider/evaluateMethods/range", function () {
	
	var mod = unitTests.requestModule("managers/components/slider/evaluateMethods/range");
	var utils = unitTests.requestModule("managers/utils");
	
	var isValid;
	var method;

	beforeEach(function () {
		
		window.X = {
			"classes":unitTests.classes,
			"slider":{
				"registerEvaluateMethod": jasmine.createSpy("X.slider.registerEvaluateMethod").and.callFake(
				
				function (name, data) {

					isValid = data.isValid;
					method = data.method;

				})
			}
		};

		utils();
		mod();

	});

	it("should register method", function () {

		// 3: ASSERT
		expect(X.slider.registerEvaluateMethod).toHaveBeenCalledWith("range", jasmine.objectContaining({
			"isValid":jasmine.any(Function),
			"method": jasmine.any(Function)
		}));

	});

	describe("isValid()", function () {
		
		it("should agree to a range 10-20", function () {

			// 1: SETUP
			var range = "10-20";

			// 2: TEST
			var result = isValid(range);

			// 3: ASSERT
			expect(result).toBe(true);

		});
	});

	describe("method()", function () {
		
		it("should work with positive number ranges", function () {

			// 1: SETUP
			var range = "1 - 10";
			var value = 5;

			// 2: TEST
			var result = method(range, value);

			// 3: ASSERT
			expect(result).toBe(true);

		});

		it("should return false if number outside of range", function () {

			// 1: SETUP
			var range = "1 - 10";
			var value = 11;

			// 2: TEST
			var result = method(range, value);

			// 3: ASSERT
			expect(result).toBe(false);

		});
		
	});
});
