describe ("managers/components/slider/view", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/view");
    var utils = unitTests.requestModule("managers/utils");

    /////////////////////////////
    ////////// Methods
    function createMC() {
      var mc = {
        "addEventListener":jasmine.createSpy(),
        "x":0,
        "y":0,
		"bounds":{
			"x":0,
			"y":0,
			"width":100,
			"height":100
		},
		"getBounds": () => {
			return mc.bounds;
		}
      }
	  return mc;
    }


    ///////////////////////
    ///// Variables
    var defaultData;
    var track;
    var handle;

    ///////////////////////
    ///// Before and After
    beforeEach(function () {

      track = createMC();
      handle = createMC();

      defaultData = {
        "variable": "myVar",
        "min": 0,
        "max": 100,
        "reverse": false,
		"orientation": "vertical",
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
	  	  "classes": unitTests.classes,
          "slider":{

          }
      };

      module();
      utils();

    });

    afterEach(function () {
      delete window.X;
    });

    it("should add the X.slider.view method", () => {

      // 1: SETUP


      // 2: TEST
      expect(X.slider.view).toEqual(jasmine.any(Function));

      // 3: ASSERT

    });

	describe("vertical alignment", () => {

		it("should align the handle with the track", () => {
			
			// 1: SETUP
			track.x = 10;
			track.y = 10;
			track.width = 10;
			track.bounds.width = 10;
			track.height = 100;
			track.bounds.height = 100;

			handle.x = 50;
			handle.y = 50;
			handle.width = 20;
			handle.bounds.width = 20;
			handle.height = 20;
			handle.bounds.height = 20;
			
			// 2: TEST
			instance = X.slider.view(defaultData);
			
			// 3: ASSERT
			expect(handle.x).toBe(5);
			expect(handle.y).toBe(10);
			
		});
		
	});


	describe("horizontal alignment", () => {

		beforeEach(function () {
			defaultData.orientation = "horizontal";
		});

		it("should align the handle with the track", () => {

			// 1: SETUP
			track.x = 10;
			track.y = 10;
			track.width = 100;
			track.bounds.width = 100;
			track.height = 10;
			track.bounds.height = 10;

			handle.x = 50;
			handle.y = 50;
			handle.width = 20;
			handle.bounds.width = 20;
			handle.height = 20;
			handle.bounds.height = 20;
			
			// 2: TEST
			instance = X.slider.view(defaultData);
			
			// 3: ASSERT
			expect(handle.x).toBe(10);
			expect(handle.y).toBe(5);
			
			
		});

		it("should work when track and handle rotated", () => {
			
			// 1: SETUP
			track.x = 100;
			track.y = 100;
			track.rotation = 90
			track.bounds.width = 10; // Actually the height
			track.bounds.height = 100; // Actually the width
			track.bounds.x = -5;
			track.bounds.y = -50;

			handle.x = 0;
			handle.y = 0;
			handle.rotation = 90;
			handle.bounds.width = 50;
			handle.bounds.height = 10;
			handle.bounds.x = -25;
			handle.bounds.y = -5;
			
			// 2: TEST
			instance = X.slider.view(defaultData);
			
			// 3: ASSERT
			expect(handle.x).toBe(55);
			expect(handle.y).toBe(100);
			
			
		});
	});

    describe("X.slider.view()", () => {

      var instance;

      beforeEach(() => {
          instance = X.slider.view(defaultData);
      })

      it("should export event listeners", () => {

        // 1: SETUP
        expect(instance.listenToTrack).toBeDefined();
        expect(instance.listenToHandle).toBeDefined();

        var a = () => {

        };

        // 2: TEST
        instance.listenToTrack("click", a);
        instance.listenToHandle("click", a);

        // 3: ASSERT
        expect(track.addEventListener).toHaveBeenCalledWith("click", a);
        expect(handle.addEventListener).toHaveBeenCalledWith("click", a);

      });



	  

      describe("update()", () => {

        it("should be defined", () => {

          // 1: SETUP
          // 2: TEST
          // 3: ASSERT
          expect(instance.update).toEqual(jasmine.any(Function));

        });

		// TEMPORARILY DISABLED WHILE WE TRY TO MIGRATE TO THE DISPLAYOBJECTPROXY 
		// Pick up from here once that has been done
		xit("should drag the handle", () => {
			
			// 1: SETUP
			track.x = 0;
			track.y = 0;
			track.bounds.width = 10;
			track.bounds.height = 100;

			handle.x = 0,
			handle.y = 0;
			handle.bounds.width = 10;
			handle.bounds.height = 10;
			
			// 2: TEST
			instance.update({
				dragStartX:5,
				dragStartY:5, // So there is a bit of offset inbetween the mouse and the handle
				dragCurrentX: 10,
				dragCurrentY: 10
			});
			
			// 3: ASSERT
			expect(handle.x).toBe(0); // No change as this is a vertical slider
			expect(handle.y).toBe(5);
			
		});
		

      });

    });
});
