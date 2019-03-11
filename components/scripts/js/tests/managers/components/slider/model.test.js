describe ("managers/components/slider/model", () => {

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
        "y":0,
	    "width":100,
		"height":100
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
        "vertical": false,
        "horizontal": true,
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

    afterAll(function () {
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

	it("should detect whether cpExtra is not loaded and create a new instance of the variable in that case", () => {

		// 1: SETUP
		hasCpExtra = false;
		defaultData.variable = "nonexistant";
		variableManager();

		// 2: TEST
		var instance = X.slider.model(defaultData);

		// 3: ASSERT
		expect(X.error).not.toHaveBeenCalled();

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

		// WE ARE TURNING THIS ONE OFF AS WE NOW DON'T WANT THE VIEW
		// TO KNOW WHAT THE CAPTIVATE VARIABLE IS
		// THE LOCATION IS CALCULATED IN THE MODEL
        xit("should send us through the updated captivate variable value", () => {

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

	  describe("dragStart(), dragMove(), dragEnd()", () => {

		var instance;

		var updateSpy;

		function expectToBeUpdatedWith(data) {
			expect(updateSpy).toHaveBeenCalledWith(jasmine.objectContaining(data));
		}

		beforeEach(() => {

			updateSpy = jasmine.createSpy("update");

			track.x = 0;
			track.y = 0;
			track.width = 100;
			track.height = 10;

			handle.x = 0;
			handle.y = 0;
			handle.width = 10;
			handle.height = 10;

			variableManager();
			  
			instance = X.slider.model(defaultData);
			instance.updateTo(updateSpy);

		});


		it("should send us through the new X/Y location while moving", () => {

			// 1: SETUP
			instance.dragStart(10,10);
			
			// 2: TEST
			instance.dragMove(10,11);

			// 3: ASSERT
			expectToBeUpdatedWith({
				dragStartX:10,
				dragStartY:10,
				dragCurrentX:10,
				dragCurrentY:11
			});


		});

	  });

    });
});
