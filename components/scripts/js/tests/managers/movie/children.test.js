/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 11:25 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for managers/movie/children", function() {
  "use strict";

  var module = unitTests.requestModule("managers/movie/children"),
    utils = unitTests.requestModule("managers/utils"),
    hook = unitTests.requestModule("managers/hook");

  beforeEach(function() {
      window.X = {
        classes: unitTests.classes,
        movie: {}
      };

      window.createjs = {
        MovieClip: {
          prototype: {
            addChildAt: function() {
              // Function to be overwritten
            }
          }
        }
      };

      hook();
      utils();
      module();
  });

  afterEach(function() {
    delete window.X;
  });

  it("should define X.movie.children", function() {
    expect(X.movie.children).toBeDefined();
  });

  describe("newChildCallback", function() {
    it("should inform us of new children", function() {
      // 1: SETUP
      var spyStar = jasmine.createSpy("newChildCallback.addCallback(*) result");
      var spyName = jasmine.createSpy(
        "newChildCallback.addCallback('name') result"
      );

      X.movie.children.newChildCallback.addCallback("*", spyStar);
      X.movie.children.newChildCallback.addCallback("foobar", spyName);

      // 2: TEST
      createjs.MovieClip.prototype.addChildAt({
        name: "foobar"
      });

      // 3: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();
    });

    it("should not inform us of children without names", function() {
      // 1: SETUP
      var spy = jasmine.createSpy("newChildCallback.addCallback(*) result");

      X.movie.children.newChildCallback.addCallback("*", spy);

      // 2: TEST
      createjs.MovieClip.prototype.addChildAt({
        name: null
      });

      // 3: ASSERT
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
