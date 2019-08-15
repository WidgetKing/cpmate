describe("managers/prefixes/registees/xBind", function() {
  // The module
  var mod = unitTests.requestModule("managers/prefixes/registees/xBind");

  // The method registered with X.registerChildPrefix()
  var boundMethods;

  // Mock movie clip that we'll send in
  var mockMovieClip;

  beforeEach(function() {
    boundMethods = {};

    movieClipMock = {
      timeline: {
        _labels: {
          first: 0,
          second: 1,
          third: 2,
          "10": 9
        }
      },
      gotoAndStop: jasmine.createSpy("movieClipMock.gotoAndStop()"),
      gotoAndPlay: jasmine.createSpy("movieClipMock.gotoAndPlay()")
    };

    window.X = {
      registerDisplayObjectNamePrefixAndVariable: jasmine
        .createSpy("X.registerDisplayObjectNamePrefix")
        .and.callFake(function(prefix, method) {
          boundMethods[prefix] = method;
        }),
      utils: {
        onNextTick: function(func) {
          return function() {
            func.apply(null, arguments);
          };
        }
      },
      classes: unitTests.classes
    };

    mod();
  });

  it("should register a method with X.registerDisplayObjectNamePrefix", function() {
    // 1: SETUP
    // 2: TEST
    // 3: ASSERT
    expect(X.registerDisplayObjectNamePrefixAndVariable).toHaveBeenCalledWith(
      "xBind",
      jasmine.any(Function)
    );
    expect(boundMethods.xBind).toBeDefined();
  });

  describe("xBind()", function() {
    it("should jump to the movie clip frame label matching the value", function() {
      // 1: SETUP

      // 2: TEST
      boundMethods.xBind(movieClipMock, "10");

      // 3: ASSERT
      expect(movieClipMock.gotoAndStop).toHaveBeenCalledWith(9);
    });

    it("should stop at the first frame if no valid value passed in", function() {
      // 1: SETUP

      // 2: TEST
      boundMethods.xBind(movieClipMock, "");

      // 3: ASSERT
      expect(movieClipMock.gotoAndStop).toHaveBeenCalledWith(0);
    });

    describe("xBindPlay", function() {
      it("should jump to the movie clip frame label matching the value AND PLAY", function() {
        // 1: SETUP

        // 2: TEST
        boundMethods.xBindPlay(movieClipMock, "10");

        // 3: ASSERT
        expect(movieClipMock.gotoAndPlay).toHaveBeenCalledWith(9);
      });
    });
  });
});
