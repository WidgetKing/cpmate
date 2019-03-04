
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

    it("should add the X.slider.controller method", () => {

      // 1: SETUP


      // 2: TEST
      expect(X.slider.controller).toEqual(jasmine.any(Function));

      // 3: ASSERT

    });

});
