fdescribe ("managers/components/slider/model", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/model");
    var variableManager = unitTests.requestModule("managers/cpVariablesManager");
    var utils = unitTests.requestModule("managers/utils");

    /////////////////////////////
    ////////// Methods
    function createMC() {
      return {
        "x":0,
        "y":0
      }
    }


    ///////////////////////
    ///// Variables
    var defaultData;
    var track;
    var handle;
    var hasCpExtra = false;

    ///////////////////////
    ///// Before and After
    beforeEach(function () {

      /////////////////////////////
      ////////// Create Data

      track = createMC();
      handle = createMC();

      defaultData = {
        "variable": "myVar",
        "min": 0,
        "max": 100,
        "reverse": false,
        "vertical": true,
        "horizontal": false,
        "handle": handle,
        "track": track,
        "hideTrack": false,
        "scrollUp": null,
        "scrollDown": null,
        "attachedItems": null,
        "trackClicking": false,
        "throwingFriction": 0,
        "handCursor": true,
        "scrollWhenOver": false,
        "scroll": false,
        "scrollStep": 10,
        "evaluation": {}
      };

      /////////////////////////////
      ////////// MOCK - variableManager
      // This needs to be defined temporarily so that CallbackObject() can access
      // the X.classes.Callback() class
      window.X = {
        "classes": unitTests.classes
      }

      function spyNFake(fake) {
          return jasmine.createSpy().and.callFake(fake)
      }

      var fakeExtraVariableManager = new unitTests.classes.CallbackObject();

      /////////////////////////////
      ////////// MOCK - Everything

      window.X = {
          "classes":unitTests.classes,
          "slider":{

          },
          "captivate":{
            "hasCpExtra": function () {
              return hasCpExtra;
            },
            "extra":{
              "variableManager":{
                "hasVariable": spyNFake(fakeExtraVariableManager.hasProp),
                "setVariableValue": spyNFake(fakeExtraVariableManager.setProp),
                "getVariableValue": spyNFake(fakeExtraVariableManager.getProp),
                "listenForVariableChange": spyNFake(fakeExtraVariableManager.callback)
              }
            }
          },
          "error": jasmine.createSpy("X.error()")
      };

      module();
      utils();

    });

    afterEach(function () {
      delete window.X;
    });





    ////////////////////////////////////////
    ////////// TESTS START HERE
    ////////////////////////////////////////

    it("should add the X.slider.model method", () => {

      // 1: SETUP
      // 2: TEST
      expect(X.slider.model).toEqual(jasmine.any(Function));

      // 3: ASSERT

    });



    describe("X.slider.model()", () => {

      it("should send a CO002 error when the variable has not been defined", () => {

        // 1: SETUP
        hasCpExtra = true;
        defaultData.variable = "nonexistant";
        variableManager();


        // 2: TEST
        var instance = X.slider.model(defaultData);


        // 3: ASSERT
        expect(X.error).toHaveBeenCalledWith("CO002", "nonexistant");

      });

      describe("update()", () => {

        var updateSpy = jasmine.createSpy();
        var instance;

        beforeEach(() => {

          hasCpExtra = false;

          variableManager();

          X.cpVariablesManager.setVariableValue("myVar", 0);

          instance = X.slider.model(defaultData);
          instance.updateTo(updateSpy);
        })

        it("should send us through the updated captivate variable value", () => {

          // 1: SETUP
          X.cpVariablesManager.setVariableValue("myVar", 50);

          // 2: TEST
          // 3: ASSERT
          expect(updateSpy).toHaveBeenCalledWith(50);


        });

      });

      describe("updateTo()", () => {


        it("should be defined", () => {

          // 1: SETUP
          variableManager();
          var instance = X.slider.model(defaultData);

          // 2: TEST


          // 3: ASSERT
          expect(instance.updateTo).toEqual(jasmine.any(Function));

        });

      });

    });
});
