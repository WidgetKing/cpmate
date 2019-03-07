describe ("managers/components/slider/validator", () => {

    ///////////////////////
    ///// Requires
    var module = unitTests.requestModule("managers/components/slider/validator");
    var utils = unitTests.requestModule("managers/utils");

    ///////////////////////
    ///// Variables
    var view = {
      "update": jasmine.createSpy()
    }

    var model = {
      "updateTo":jasmine.createSpy()
    }

    ///////////////////////
    ///// Before and After
    beforeEach(function () {

        window.X = {
            "error": jasmine.createSpy()
        };

        module();
        utils();

        // We have to add the spies after the module has been called
        // because then otherwise the module will apply an object to
        // X.slider and erase the spies.
        X.slider.view = jasmine.createSpy().and.callFake(() => {
          return view;
        });

        X.slider.controller = jasmine.createSpy();

        X.slider.model = jasmine.createSpy().and.callFake(() => {
          return model;
        });
    });

    afterEach(() => {

        delete window.X;

    });

    ///////////////////////
    ///// Tests
    describe("X.slider()", function () {

      function eqlObj(obj) {
          // expect(test).toEqual(jasmine.objectContaining(obj));
          expect(X.slider.model).toHaveBeenCalledWith(obj);
      }

      it("should be defined", () => {

        // 1: SETUP


        // 2: TEST
          expect(X.slider).toBeDefined();
          expect(X.slider).toEqual(jasmine.any(Function));

        // 3: ASSERT


      });

      it("should add default settings", () => {
        // 1: SETUP
          X.slider({
              "variable": "myVar",
              "handle": "handle",
              "track": "track"
          });

        // 2: TEST


        // 3: ASSERT
        eqlObj({
          "variable": "myVar",
          "min": 0,
          "max": 100,
          "reverse": false,
          "vertical": true,
          "horizontal": false,
          "handle": "handle",
          "track": "track",
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
        });
      });


    });

    it("should throw errors if we have not passed in the required properties", () => {

      // 1: SETUP
      // 2: TEST
      X.slider({
        // Nothing provided
      });

      // 3: ASSERT
      expect(X.error).toHaveBeenCalledWith("CE001", "variable");
      expect(X.error).toHaveBeenCalledWith("CE001", "handle");
      expect(X.error).toHaveBeenCalledWith("CE001", "track");

    });

    it("should wire up MVC pattern", () => {

      // 1: SETUP


      // 2: TEST
      X.slider({
          "variable": "myVar",
          "handle": "handle",
          "track": "track"
      });

      // 3: ASSERT
      expect(X.slider.model).toHaveBeenCalledWith(jasmine.any(Object)); // data
      expect(X.slider.view).toHaveBeenCalledWith(jasmine.any(Object)); // data
      expect(X.slider.controller).toHaveBeenCalledWith(
        view,
        model
      );

      expect(model.updateTo).toHaveBeenCalledWith(view.update);

    });
});
