describe ("managers/components/slider/model", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/model");
    var variableManager = unitTests.requestModule("managers/cpVariablesManager");
    var utils = unitTests.requestModule("managers/utils");
    var hook = unitTests.requestModule("managers/hook");

    /////////////////////////////
    ////////// Methods
    function createMC() {
	  var bounds = {
			"width":100,
			"height":100,
			"x":0,
			"y":0
	  };
	  
      return {
        "x":0,
        "y":0,
		"bounds":bounds,
		"getBounds": () => {
			return bounds;
		}
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
		  "cpExtraActions": {
			"register": () => true // Just to get the cpVariablesManager module working
		  },
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
		hook();
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

			track.x = 10;
			track.y = 0;
			track.bounds.width = 110;
			track.bounds.height = 10;

			handle.x = 10;
			handle.y = 0;
			handle.bounds.width = 10;
			handle.bounds.height = 10;

			variableManager();
			  
			instance = X.slider.model(defaultData);
			instance.updateTo(updateSpy);

		});


		it("should send us through the new X/Y location while moving", () => {

			// 1: SETUP
			instance.dragStart(15,5);
			
			// 2: TEST
			instance.dragMove(16,5);

			// 3: ASSERT
			expectToBeUpdatedWith({
				"handlePosition":11
			});


		});

		it("should not move beyond upper limits of track", () => {
			
			// 1: SETUP
			instance.dragStart(10, 0);
			
			// 2: TEST
			instance.dragMove(-10, 0);		
			
			// 3: ASSERT
			expectToBeUpdatedWith({
				"handlePosition":10
			});
			
		});
		
		it("should not move beyond upper limits of track", () => {
			
			// 1: SETUP
			instance.dragStart(10, 0);
			
			// 2: TEST
			instance.dragMove(300, 0);		
			
			// 3: ASSERT
			expectToBeUpdatedWith({
				"handlePosition":110
			});
			
		});

		describe("update FROM CaptivateVariable", () => {
			
			function setVar(num) {
				X.cpVariablesManager.setVariableValue(defaultData.variable, num);
			}
			
			it("should update to minimum", () => {
				
				// 1: SETUP
				// 2: TEST
				setVar(100);
				
				// 3: ASSERT
				expectToBeUpdatedWith({
					"handlePosition":110
				});
				
			});

		});

		describe("update TO Captivate Variable", () => {

			function expectVarSetTo (num) {
				expect(X.cpVariablesManager.setVariableValue).toHaveBeenCalledWith("myVar", num);
			}

			beforeEach(() => {

				// this is here because we keep getting an error saying that
				// this function has already been spied on
				// hopefully this if check will help us avoid this.
				if (!X.cpVariablesManager.setVariableValue.hasOwnProperty("and")) {
					spyOn(X.cpVariablesManager, "setVariableValue");
				}	

			});


			it("should update to max", () => {
				
				// 1: SETUP
				instance.dragStart(10, 0);
				
				// 2: TEST
				// move to upper limit
				instance.dragMove(120, 0);
				
				// 3: ASSERT
				// should equal highest value
				expectVarSetTo(100);
				
			});


			it("should update to min", () => { 

				// 1: SETUP
				instance.dragStart(10, 0);
				
				// 2: TEST
				// move to lower limit
				instance.dragMove(-100, 0);
				
				// 3: ASSERT
				// should equal lowest value
				expectVarSetTo(0);
				
			});

			it("should update to middle", () => { 

				// 1: SETUP
				instance.dragStart(10, 0);
				
				// 2: TEST
				// move to middle of track
				instance.dragMove(60, 0);
				
				// 3: ASSERT
				// should equal lowest value
				expectVarSetTo(50);
				
			});


			it("should update to negative values when minimum is negative", () => { 

				// 1: SETUP
				defaultData.min = -50;
				defaultData.max = 50;
				instance.dragStart(10, 0);
				
				// 2: TEST
				// move to lower limit
				instance.dragMove(-300, 0);
				
				// 3: ASSERT
				// should equal lowest value
				expectVarSetTo(-50);
				
				// TEST
				instance.dragMove(60, 0);
				// ASSERT
				expectVarSetTo(0);

			});

			it("should update to whole numbers", () => { 

				// 1: SETUP
				defaultData.min = 0;
				defaultData.max = 10;
				instance.dragStart(10, 0);
				
				// 2: TEST
				instance.dragMove(65, 0);
				
				// 3: ASSERT
				// If it wasn't rounded this would be: 5.5
				expectVarSetTo(6);
				
			});

		});
		
	  });

    });
});
