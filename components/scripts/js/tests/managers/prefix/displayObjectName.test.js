describe("managers/prefix/displayObjectName", function () {
	
	// MODULES
	var mod = unitTests.requestModule("managers/prefix/displayObjectName");
	var utils = unitTests.requestModule("managers/utils");
	
	// VARIABLES
	var handleNewTimeline;

	// METHODS
	function addToChildrenList (list) {
	
		list.forEach(function (name) {

			X.movie.children.list[name] = {
				"name":name
			}

		})

	}

	function calledWithMC (method, name) {

		expect(method).toHaveBeenCalledWith(jasmine.objectContaining({
			"name":name
		}));

	}
	
	function notCalledWithMC (method, name) {

		expect(method).not.toHaveBeenCalledWith(jasmine.objectContaining({
			"name":name
		}));

	}
	
	beforeEach(function () {

		window.X = {
			"classes":unitTests.classes,
			"movie":{
				"children":{
					"changeCallback": new unitTests.classes.Callback(),
					"list": {}
				}
			}
		};

		utils();

		spyOn(X.movie.children.changeCallback, "addCallback").and.callFake(function (key, method) {

			handleNewTimeline = method;
			
		});

		mod();

	});

	afterEach(function () {
		delete window.X;
	});

	describe("registerDisplayObjectNamePrefix()", function () {
		
		it("should exist", function () {

			// 1: SETUP
			// 2: TEST
			// 3: ASSERT
			expect(X.registerDisplayObjectNamePrefix).toBeDefined();

		});
		
	});

	describe("handleNewTimeline()", function () {
		
		it("should inform us of any children matching our registered prefix", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			var spy_barfoo = jasmine.createSpy("xBarFoo registered method");
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar)
			X.registerDisplayObjectNamePrefix("xBarFoo", spy_barfoo)

			addToChildrenList(["bill", "xFooBar_1", "murry", "xFooBar_2", "xBarFoo"]);
			
			// 2: TEST
			handleNewTimeline();

			// 3: ASSERT
			calledWithMC(spy_foobar, "xFooBar_1");
			calledWithMC(spy_foobar, "xFooBar_2");
			calledWithMC(spy_barfoo, "xBarFoo");

			notCalledWithMC(spy_foobar, "bill");
			notCalledWithMC(spy_foobar, "murry");
			notCalledWithMC(spy_foobar, "xBarFoo");

		});		

		it("should not recall any objects that have already been called", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar)

			addToChildrenList(["xFooBar_1"]);

			handleNewTimeline();
			
			calledWithMC(spy_foobar, "xFooBar_1");

			// 2: TEST
			spy_foobar.calls.reset();

			addToChildrenList(["xFooBar_2"]);
			
			handleNewTimeline();

			// 3: ASSERT
			calledWithMC(spy_foobar, "xFooBar_2");
			notCalledWithMC(spy_foobar, "xFooBar_1");
		});
		
		it("should not be case sensitive", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			addToChildrenList(["xfoobar_1"]);

			// 2: TEST
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar);			
			handleNewTimeline();

			// 3: ASSERT
			calledWithMC(spy_foobar, "xfoobar_1");
			

		});
	});

});
