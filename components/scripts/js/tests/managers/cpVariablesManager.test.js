describe("managers/cpVariables", () => {

  var module = unitTests.requestModule("managers/cpVariablesManager");

  var hasCpExtra = true;

  beforeEach(() => {

    function spyNFake(fake) {
        return jasmine.createSpy().and.callFake(fake)
    }

    var fakeExtraVariableManager = new unitTests.classes.CallbackObject();

    window.X = {
      "classes": unitTests.classes,
      "captivate":{
        "hasCpExtra": function () {
          return hasCpExtra;
        },
        "extra":{ // _extra.variableManager.listenForVariableChange
          "variableManager":{
            "listenForVariableChange": spyNFake(fakeExtraVariableManager.callback),
            "setVariableValue": spyNFake(fakeExtraVariableManager.setProp),
            "getVariableValue": spyNFake(fakeExtraVariableManager.getProp),
            "hasVariable": spyNFake(fakeExtraVariableManager.hasVariable)
          }
        }
      }
    };


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

});
