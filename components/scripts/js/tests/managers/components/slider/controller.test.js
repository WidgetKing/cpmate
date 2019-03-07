describe ("managers/components/slider/controller", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/controller");
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
	var trackEvents = {};
	var handleEvents = {};
	var documentEvents = {};
	var handleOnMouseDown;

    ///////////////////////
    ///// Mocks
	var mockView = {
		"listenToTrack": jasmine.createSpy("view.listenToTrack").and.callFake((event, method) => {
			trackEvents[event] = method;
		}),
		"listenToHandle": jasmine.createSpy("view.listenToHandle").and.callFake((event, method) => {
			handleEvents[event] = method;
		})
	};

	var mockModel = {
		"dragStart":jasmine.createSpy("model.dragStart"),
		"dragMove": jasmine.createSpy("model.dragMove"),
		"dragEnd": jasmine.createSpy("model.dragEnd")
	};



	var mockMobileEvents = {

		// "mousedown", "touchstart"
	}

    ///////////////////////
    ///// Before and After
    beforeEach(function () {

      track = createMC();
      handle = createMC();

		spyOn(document,'addEventListener').and.callFake((event, method) => {
			documentEvents[event] = method;
		});

		spyOn(document, 'removeEventListener').and.callFake((event, method) => {
			delete documentEvents[event];
		});

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


      window.X = {
	  		"animate":{
				"stage":{
					"mouseX":0,
					"mouseY":0
				}
			},
			"events":{
				"getSafeEvent": (event) => {
					if (mockMobileEvents.hasOwnProperty(event)) {
						return mockMobileEvents[event];
					}
					return event;
				}
			},
		  "slider":{

		  }
      };

      module();
      utils();

    });

    afterEach(function () {
      delete window.X;
    });

    it("should add the X.slider.controller method", () => {

      // 1: SETUP


      // 2: TEST
      expect(X.slider.controller).toEqual(jasmine.any(Function));

      // 3: ASSERT

    });

	describe("X.slider.controller()", () => {

		var instance;

		beforeEach(() => {
			instance = X.slider.controller(mockView, mockModel);
		});

		it("should add handlers to event listeners provied by view", () => {

			expect(mockView.listenToTrack).toHaveBeenCalledWith('mousedown', jasmine.any(Function));
			expect(mockView.listenToHandle).toHaveBeenCalledWith('mousedown', jasmine.any(Function));

			// Our mock for capturing the event should also be working
			expect(trackEvents.mousedown).toBeDefined();

		});

		describe("mousedown on handle", () => {

			it("should inform model of a new drag", () => {

				// 1: SETUP
				X.animate.stage.mouseX = 1;
				X.animate.stage.mouseY = 2;

				// 2: TEST
				handleEvents.mousedown();

				// 3: ASSERT
				expect(mockModel.dragStart).toHaveBeenCalledWith(1, 2);

			});

			it("should listen for mouse move and inform of new location", () => {

				// 1: SETUP
				handleEvents.mousedown();
				expect(documentEvents.mousemove).toBeDefined();

				X.animate.stage.mouseX = 10;
				X.animate.stage.mouseY = 20;

				// 2: TEST
				documentEvents.mousemove();
				expect(mockModel.dragMove).toHaveBeenCalledWith(10, 20);
			});

			it("should inform the model when the drag ends", () => {

				// 1: SETUP
				handleEvents.mousedown();
				documentEvents.mousemove()

				// 2: TEST
				documentEvents.mouseup();

				expect(mockModel.dragEnd).toHaveBeenCalled();
				expect(documentEvents.mousemove).not.toBeDefined();

			});
		});

	});
});
