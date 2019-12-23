describe("managers/prefix/displayObjectName", function () {
	
	// MODULES
	var mod = unitTests.requestModule("managers/prefix/displayObjectName");
	var utils = unitTests.requestModule("managers/utils");

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
					"newChildCallback": new unitTests.classes.Callback(),
					"changeCallback": new unitTests.classes.Callback(),
					"list": {}
				}
			}
		};

		utils();

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

	describe("newChildCallback.addCallback(*)", function () {
		
		function sendChildren(children) {

			children.forEach(function (childName) {

				X.movie.children.newChildCallback.sendToCallback("*", {
					name:childName
				});

			})

		}
		
		it("should inform us of any children matching our registered prefix", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			var spy_barfoo = jasmine.createSpy("xBarFoo registered method");
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar)
			X.registerDisplayObjectNamePrefix("xBarFoo", spy_barfoo)

			
			// 2: TEST
			sendChildren(["bill", "xFooBar_1", "murry", "xFooBar_2", "xBarFoo"]);

			// 3: ASSERT
			calledWithMC(spy_foobar, "xFooBar_1");
			calledWithMC(spy_foobar, "xFooBar_2");
			calledWithMC(spy_barfoo, "xBarFoo");

			notCalledWithMC(spy_foobar, "bill");
			notCalledWithMC(spy_foobar, "murry");
			notCalledWithMC(spy_foobar, "xBarFoo");

		});		

		it("should recall an object even if it has been called before", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar)

			sendChildren(["xFooBar_1"]);

			
			calledWithMC(spy_foobar, "xFooBar_1");

			// 2: TEST
			spy_foobar.calls.reset();

			sendChildren(["xFooBar_2"]);
			

			// 3: ASSERT
			calledWithMC(spy_foobar, "xFooBar_2");
			notCalledWithMC(spy_foobar, "xFooBar_1");
		});
		
		it("should not be case sensitive", function () {

			// 1: SETUP
			var spy_foobar = jasmine.createSpy("xFooBar registered method");
			X.registerDisplayObjectNamePrefix("xFooBar", spy_foobar);			

			// 2: TEST
			sendChildren(["xfoobar_1"]);

			// 3: ASSERT
			calledWithMC(spy_foobar, "xfoobar_1");
			

		});
		
	});

});
