
describe ("managers/components/slider/view", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/view");
    var utils = unitTests.requestModule("managers/utils");

    /////////////////////////////
    ////////// Methods
    function createMC() {
      return {
        "addEventListener":jasmine.createSpy(),
        "x":0,
        "y":0
      }
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

      });

    });
});
