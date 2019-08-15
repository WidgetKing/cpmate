describe("managers/cpVariablesManager", () => {

  var module = unitTests.requestModule("managers/cpVariablesManager");
  var hookModule = unitTests.requestModule("managers/hook");
  var utilsModule = unitTests.requestModule("managers/utils");

  var hasCpExtra = true;

  // To be assigned by the X.cpExtraActions.register method
  var moduleUnload;

  beforeEach(() => {
    function spyNFake(fake) {
        return jasmine.createSpy().and.callFake(fake)
    }

    // We need this here so that the CallbackObject can
    // access X.classes.Callback()
    window.X = {
      "classes": unitTests.classes
    }

    var fakeExtraVariableManager = new unitTests.classes.CallbackObject();

    window.X = {
      "classes": unitTests.classes,
	  "broadcast": {
		"addCallback": (key, callback) => {
			moduleUnload = callback;
		}
	  },
      "captivate":{
        "hasCpExtra": function () {
          return hasCpExtra;
        },
        "extra":{ // _extra.variableManager.listenForVariableChange
          "variableManager":{
            "listenForVariableChange": spyNFake(fakeExtraVariableManager.callback),
            "setVariableValue": spyNFake(fakeExtraVariableManager.setProp),
            "getVariableValue": spyNFake(fakeExtraVariableManager.getProp),
            "hasVariable": spyNFake(fakeExtraVariableManager.hasProp),
			"stopListeningForVariableChange": spyNFake(fakeExtraVariableManager.removeCallback)
          }
        }
      }
    };

	hookModule();
	utilsModule();

  })

  afterEach(() => {
    delete window.X;
  });

  it("should define X.cpVariables", () => {

    module();
    expect(X.cpVariablesManager).toBeDefined();

  });

  describe("X.cpVariablesManager.listenForVariableChange()", () => {

    it("should pass on to CpExtra when it is installed", () => {

      // 1: SETUP
      hasCpExtra = true;
      var a = () => {

      };

      // 2: TEST
      module();

      X.cpVariablesManager.listenForVariableChange("var", a);

      // 3: ASSERT
      expect(X.captivate.extra.variableManager.listenForVariableChange).toHaveBeenCalledWith("var", a);

    });

    it("should fake cpVariables when CpExtra is not installed", () => {

      // 1: SETUP
      hasCpExtra = false;
      var a = jasmine.createSpy();
      module();

      // 2: TEST
      X.cpVariablesManager.listenForVariableChange("var", a);

      X.cpVariablesManager.setVariableValue("var", "foobar");

      // 3: ASSERT
      expect(a).toHaveBeenCalledWith("foobar");

    });

  });

 describe("X.cpVariablesManager.listenForVariableChange()", () => {

	it("X.cpVariablesManager.stopListeningForVariableChange", () => {
		
		// 1: SETUP
		hasCpExtra = false;
		var spy = jasmine.createSpy("spy");
		module();
		
		// 2: TEST
		X.cpVariablesManager.listenForVariableChange("var", spy);
		X.cpVariablesManager.stopListeningForVariableChange("var", spy);
		X.cpVariablesManager.setVariableValue("var", "foobar");
		
		// 3: ASSERT
		expect(spy).not.toHaveBeenCalled();
		
	});


 });

  describe("Unload callback", () => {

	it("should register an unload callback with X.cpExtraActions.register()", () => {
		
		// 1: SETUP
		module();

		// 2: TEST
		// 3: ASSERT
		expect(moduleUnload).toBeDefined();
		
	});

	it("should unload all the listeners that were added through the course of the movie", () => {
		
		// 1: SETUP
		module();

		var spy = jasmine.createSpy("spy");

		X.cpVariablesManager.listenForVariableChange("var", spy);
		
		// 2: TEST
		moduleUnload();
		
		X.cpVariablesManager.setVariableValue("var", "foobar");
		// 3: ASSERT
		
		expect(spy).not.toHaveBeenCalled();
	});
	  
	it("should unload multiple listeners to the same event", function () {

		// 1: SETUP
		module();

		var spy1 = jasmine.createSpy("spy1"),
			spy2 = jasmine.createSpy("spy2"); 

		X.cpVariablesManager.listenForVariableChange("var", spy1);
		X.cpVariablesManager.listenForVariableChange("var", spy2);

		// 2: TEST
		moduleUnload();
		X.cpVariablesManager.setVariableValue("var", "foobar");

		// 3: ASSERT
		expect(spy1).not.toHaveBeenCalled();
		expect(spy2).not.toHaveBeenCalled();

	});
	
  });
});
