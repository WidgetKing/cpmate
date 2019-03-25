describe("managers/components/slider/evaluate", function () {
	
	var mod = unitTests.requestModule("managers/components/slider/evaluate");
	var mouseEvents = unitTests.requestModule("managers/mouseEvents"); 
	var utils = unitTests.requestModule("managers/utils");
	
	var mockData;
	var variableValue;
	var evaluateResult = true;

	var evaluateMethodSpy = jasmine.createSpy("X.slider.evaluateMethods[0]()").and.callFake(function () {
		return evaluateResult;
	})

	beforeEach(function () {
		
		window.X = {
			"classes":unitTests.classes,
			"error": jasmine.createSpy("X.error"),
			"captivate":{
				"hasCpExtra": () => true,
				"extraCallActionOn": jasmine.createSpy("X.captivate.extraCallActionOn")
			},
			"cpVariablesManager":{
				"getVariableValue":function () {

					return variableValue;

				}
			},
			"slider": {
				"evaluateMethods":{ 
					"default": {
						"isValid": function () {

							return true;

						},

						"method": evaluateMethodSpy
					}
				}
			}
		};

		utils();
		mouseEvents();
		mod();

	});

	afterEach(function () {
		delete window.X;
	});


	it("should define X.slider.evaluate()", function () {

		// 1: SETUP
		// 2: TEST
		// 3: ASSERT
		expect(X.slider.evaluate).toBeDefined();

	});

	describe("X.slider.evaluate()", function () {
		
		var defaultThen = jasmine.createSpy("defaultThen");
		
		beforeEach(function () {
			
			mockData = {
				"on":"continually",
				"criteria":[
					{
						"if":"default",
						"then":defaultThen
					},
					{
						"if":"invalid",
						"then": function () { }
					}
				]
			}

		});

		function getInstance () {

			return X.slider.evaluate(mockData);

		}
		
		describe("evaluation methods handling", function () {
			
			function testCriteria (data) {

				/*
				 * Data should have the following properties
				 * - criteria
				 * - isValid
				 * - method
				 * - variableValue
				 */
				
				mockData.criteria = data.criteria;

				X.slider.evaluateMethods = {
					"default":{
						"isValid": data.isValid,
						"method": data.method
					}
				};

				var instance = getInstance();

				variableValue = data.variableValue;

				instance.dragMove();
			}
			
			it("should associate criteria with their valid evaluation method", function () {

				// 1: SETUP
				var thenSpy = jasmine.createSpy("criteria.then");
				var methodSpy = jasmine.createSpy("methodSpy").and.returnValue(true);
				
				// 2: TEST
				testCriteria({
					"criteria":[{
						"if":10,
						"then":thenSpy
					}],
					"isValid": function () {

						return true;

					},
					"method": methodSpy,
					"variableValue": "not required for test"
				});

				// 3: ASSERT
				expect(methodSpy).toHaveBeenCalled();

				expect(thenSpy).toHaveBeenCalled();
			});

			it("should separate comma delimited criteria", function () {

				// 1: SETUP
				var thenSpy = jasmine.createSpy("criteria.then");
				var methodSpy = jasmine.createSpy("methodSpy").and.returnValue(true);
				
				// 2: TEST
				testCriteria({
					"criteria":[{
						"if":"10, 20, 30",
						"then":thenSpy
					}],
					"isValid": function (value) {

						return true;

					},
					"method": methodSpy,
					"variableValue": "not required for test"
				});

				// 3: ASSERT
				expect(methodSpy.calls.count()).toBe(3);

			});

			it("should call the 'then' property as a Captivte action name", function () {


				// 1: SETUP
				var actionName = "HAN_foobar";
				var methodSpy = jasmine.createSpy("methodSpy").and.returnValue(true);
				
				// 2: TEST
				testCriteria({
					"criteria":[{
						"if":10,
						"then":actionName
					}],
					"isValid": function () {

						return true;

					},
					"method": methodSpy,
					"variableValue": "not required for test"
				});

				// 3: ASSERT
				expect(methodSpy).toHaveBeenCalled();
				expect(X.captivate.extraCallActionOn).toHaveBeenCalledWith(actionName);

			});
			it("should call the default evaluator if none of the others succeed", function () {

				// 1: SETUP
				var normalThenSpy = jasmine.createSpy("criteria.then");
				var methodSpy = jasmine.createSpy("methodSpy").and.returnValue(false);
				var defaultThenSpy = jasmine.createSpy("defaultThenSpy");
				
				// 2: TEST
				testCriteria({
					"criteria":[{
						"if":10,
						"then":normalThenSpy
					},
					{
						"if":"default",
						"then":defaultThenSpy
					}],
					"isValid": function (condition) {

						return condition === 10;

					},
					"method": methodSpy,
					"variableValue": "not required for test"
				});

				// 3: ASSERT
				expect(methodSpy).toHaveBeenCalled();
				expect(defaultThenSpy).toHaveBeenCalled();
				expect(normalThenSpy).not.toHaveBeenCalled();

			});
		});

		describe("export methods", function () {
			
			describe("dragMove()", function () {
				
				it("should be defined", function () {

					expect(getInstance().dragMove).toBeDefined();

				});

				it("should trigger evaluate if data.on = 'continually'", function () {

					// 1: SETUP
					mockData.on = "CONTINUALLY"; // just testing toLowerCase while we're at it.
					var instance = getInstance();

					// 2: TEST
					instance.dragMove();

					// 3: ASSERT
					expect(evaluateMethodSpy).toHaveBeenCalled();

				});
				
			});

			describe("dragEnd()", function () {
				
				it("should be defined", function () {

					expect(getInstance().dragEnd).toBeDefined();

				});

				it("should trigger evaluate if data.on = 'mouseup'", function () {

					// 1: SETUP
					var spy = jasmine.createSpy("default spy");
					
					mockData.on = "MOUSEUP";
					mockData.criteria = [{
						"if":"default",
						"then": spy
					}]
					
					var instance = getInstance();




					// 2: TEST
					instance.dragMove();

					expect(spy).not.toHaveBeenCalled();

					instance.dragEnd();	




					// 3: ASSERT
					expect(spy).toHaveBeenCalled();
					

				});
				
			});

		});

		describe("button handler", function () {
			
			it("should evaluate on button click if data.on = 'button'", function () {

				// 1: SETUP
				var handler;
				var mockButton = {
					"addEventListener": jasmine.createSpy("mockButton.addEventListener").and.callFake(function (event, method) {
						handler = method;
					})
				};
				
				mockData.on = "BUTTON";
				mockData.button = mockButton;
				
				
				// 2: TEST
				var instance = getInstance();

				expect(mockButton.addEventListener).toHaveBeenCalledWith("click", handler);

				handler();

				// 3: ASSERT
				expect(evaluateMethodSpy).toHaveBeenCalled();
				

			});
			
		});
		
		describe("should throw error CO003 when...", function () {
			
			it("...'on' property not defined", function () {

				// 1: SETUP
				delete mockData.on;

				// 2: TEST
				getInstance();

				// 3: ASSERT
				expect(X.error).toHaveBeenCalledWith("CO003", "on");

			});
			
			it("...'criteria' property not defined", function () {

				// 1: SETUP
				delete mockData.criteria;

				// 2: TEST
				getInstance();

				// 3: ASSERT
				expect(X.error).toHaveBeenCalledWith("CO003", "criteria");

			});
		});

	});
});
