describe("managers/prefix/displayObjectNameAndVariable", function() {
  var mod = unitTests.requestModule(
    "managers/prefix/displayObjectNameAndVariable"
  );
  var displayObjectName = unitTests.requestModule(
    "managers/prefix/displayObjectName"
  );
  var utils = unitTests.requestModule("managers/utils");

  // VARIABLES
  var hasCpExtra;

  // METHODS
		function sendChildren(children) {

			children.forEach(function (childName) {

				X.movie.children.newChildCallback.sendToCallback("*", {
					name:childName
				});

			})

		}

  function expectCallTo(spy, movieClipName, value) {
    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: movieClipName
      }),
      value
    );
  }

  beforeEach(function() {
    // We have this line here just in case the last test suite
    // forgot to delete window.X and that will effect us
    // instantiating the CallbackObject below.
    delete window.X;

    var fakeVariables = new unitTests.classes.CallbackObject();

    hasCpExtra = true;

    window.X = {
      error: jasmine.createSpy("X.error()"),
      classes: unitTests.classes,
      captivate: {
        hasCpExtra: () => hasCpExtra
      },
      movie: {
        children: {
          newChildCallback: new unitTests.classes.Callback(),
          list: {}
        }
      },
      cpVariablesManager: {
        listenForVariableChange: function(variableName, callback) {
          return fakeVariables.callback(variableName, function() {
            callback({
              event: "event"
            });
          });
        },
        setVariableValue: fakeVariables.setProp,

        getVariableValue: fakeVariables.getProp,

        hasVariable: fakeVariables.hasProp,

        stopListeningForVariableChange: fakeVariables.removeCallback
      }
    };

    utils();
    displayObjectName();
    mod();
  });

  afterEach(function() {
    delete window.X;
  });

  it("should define X.registerDisplayObjectNamePrefixAndVariable()", function() {
    // 1: SETUP
    // 2: TEST
    // 3: ASSERT
    expect(X.registerDisplayObjectNamePrefixAndVariable).toBeDefined();
  });

  describe("registerDisplayObjectNamePrefixAndVariable()", function() {
    it("should update the method with the variable value and movieclip", function() {
      // 1: SETUP
      var variableName = "myvar";
      var variableValue = "value";
      var movieClipName = "xfoobar_myvar_1";

      var spy = jasmine.createSpy("method");

      // creating variable
      X.cpVariablesManager.setVariableValue(variableName, variableValue);

      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClipName]);

      // 3: ASSERT
      expectCallTo(spy, movieClipName, variableValue);
    });

    it("should work with multiple movieclips trying to register to same variable", function() {
      // 1: SETUP
      var variableName = "myvar";
      var variableValue = "value";
      var movieClip1Name = "xfoobar_myvar";
      var movieClip2Name = "xfoobar_myvar_1";
		hasCpExtra = true;

      var spy = jasmine.createSpy("movieClip1");

      // creating variable
      X.cpVariablesManager.setVariableValue(variableName, variableValue);

      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClip1Name, movieClip2Name]);

      // 3: ASSERT
		expect(spy.calls.count()).toBe(2);
    });

    it("should find variable name even if doesn't match movieClip name", function() {
      // 1: SETUP
      var variableName = "my_var";
      var variableValue = "value";
      var movieClipName = "xfoobar_my_var_is_well_known_1";

      var spy = jasmine.createSpy("method");

      X.cpVariablesManager.setVariableValue(
        variableName,
        "make variable exist"
      );

      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClipName]);

      X.cpVariablesManager.setVariableValue(variableName, variableValue);

      // 3: ASSERT
      expectCallTo(spy, movieClipName, variableValue);
    });

    it("should throw and error if no matching variable found", function() {
      // 1: SETUP
      var movieClipName = "xfoobar_non_existant_variable";

      var spy = jasmine.createSpy("method");

      spyOn(X.cpVariablesManager, "listenForVariableChange");

      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClipName]);

      // 3: ASSERT
      expect(
        X.cpVariablesManager.listenForVariableChange
      ).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      expect(X.error).toHaveBeenCalledWith("PR001", movieClipName);
    });

    it("should create a fake variable if we are not in Captivate", function() {
      // 1: SETUP
      var movieClipName = "xfoobar_non_existant_variable";
      var variableValue = "value";
      var variableName = "non_existant_variable";
      var spy = jasmine.createSpy("method");

      // This is really the crux of the test right here
      hasCpExtra = false;


      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClipName]);
      X.cpVariablesManager.setVariableValue(variableName, variableValue);

      // 3: ASSERT
      expectCallTo(spy, movieClipName, variableValue);
    });


    it("should when outside of Captivate still link two variables together, even if there is a _1 suffix", function() {
      // 1: SETUP
      var variableName = "myvar";
      var variableValue = "value";
      var movieClip1Name = "xfoobar_myvar";
      var movieClip2Name = "xfoobar_myvar_1";
		hasCpExtra = false;

      var spy = jasmine.createSpy("movieClip1");

      // creating variable
      X.cpVariablesManager.setVariableValue(variableName, variableValue);
		spyOn(X.cpVariablesManager, "setVariableValue");

      // 2: TEST
      X.registerDisplayObjectNamePrefixAndVariable("xfoobar", spy);

      sendChildren([movieClip1Name, movieClip2Name]);

      // 3: ASSERT
		// should not have created another variable
		expect(X.cpVariablesManager.setVariableValue).not.toHaveBeenCalled();
    });
  });
});
