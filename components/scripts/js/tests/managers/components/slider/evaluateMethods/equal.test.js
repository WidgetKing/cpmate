describe("managers/components/slider/evaluateMethods/equal", function () {
	
	var mod = unitTests.requestModule("managers/components/slider/evaluateMethods/equal");
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
		expect(X.slider.registerEvaluateMethod).toHaveBeenCalledWith("equals", jasmine.objectContaining({
			"isValid":jasmine.any(Function),
			"method": jasmine.any(Function)
		}));

	});

	describe("isValid()", function () {
		
		it("should agree to a number", function () {

			expect(isValid(1)).toBe(true);

		});
		
		it("should agree to a string of a number", function () {

			expect(isValid("1")).toBe(true);

		});
		
		it("should disagree to a range", function () {

			expect(isValid("1-10")).toBe(false);

		});
	});

	describe("method()", function () {
		
		it("should return true to condition of 1 and value of 1", function () {

			// 1: SETUP
			

			// 2: TEST
			var result = method(1, 1);

			// 3: ASSERT
			expect(result).toBe(true);

		});
		
		it("should work with strings", function () {

			// 1: SETUP
			

			// 2: TEST
			var result = method("5", 5);

			// 3: ASSERT
			expect(result).toBe(true);

		});

		it("should return false if there is no match", function () {

			// 1: SETUP
			

			// 2: TEST
			var result = method(10, "5")

			// 3: ASSERT
			expect(result).toBe(false);

		});
	});
});
