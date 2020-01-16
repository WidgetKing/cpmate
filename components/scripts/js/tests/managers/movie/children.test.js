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
          _addManagedChild: function() {
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
      createjs.MovieClip.prototype._addManagedChild({
        name: "foobar",
        _off: false
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
      createjs.MovieClip.prototype._addManagedChild({
        name: null,
        _off: false
      });

      // 3: ASSERT
      expect(spy).not.toHaveBeenCalled();
    });

    it("should not inform us if the same child is added at a different location", function() {
      // 1: SETUP
      var spyStar = jasmine.createSpy("newChildCallback.addCallback(*) result");
      var spyName = jasmine.createSpy(
        "newChildCallback.addCallback('name') result"
      );

      X.movie.children.newChildCallback.addCallback("*", spyStar);
      X.movie.children.newChildCallback.addCallback("foobar", spyName);

      // 2: TEST
      var child = {
        name: "foobar",
        _off: false
      };
      createjs.MovieClip.prototype._addManagedChild(child);

      // 3: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();

      // 4: TEST
      spyStar.calls.reset();
      spyName.calls.reset();
      // Add the same child again
      createjs.MovieClip.prototype._addManagedChild(child);

      // 5: ASSERT
      expect(spyStar).not.toHaveBeenCalled();
      expect(spyName).not.toHaveBeenCalled();
    });

    it("should inform us of a child with the same name but is a different object", function() {
      // 1: SETUP
      var spyStar = jasmine.createSpy("newChildCallback.addCallback(*) result");
      var spyName = jasmine.createSpy(
        "newChildCallback.addCallback('name') result"
      );

      X.movie.children.newChildCallback.addCallback("*", spyStar);
      X.movie.children.newChildCallback.addCallback("foobar", spyName);

      // 2: TEST
      var child = {
        name: "foobar",
        _off: false
      };
      createjs.MovieClip.prototype._addManagedChild(child);

      // 3: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();

      // 4: TEST
      spyStar.calls.reset();
      spyName.calls.reset();

      // Add different child
      var child2 = {
        name: "foobar",
        _off: false
      };
      createjs.MovieClip.prototype._addManagedChild(child2);

      // 5: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();
    });

    it("should inform us of same child again if its '_off' property was toggled", function() {
      // 1: SETUP
      var spyStar = jasmine.createSpy("newChildCallback.addCallback(*) result");
      var spyName = jasmine.createSpy(
        "newChildCallback.addCallback('name') result"
      );

      X.movie.children.newChildCallback.addCallback("*", spyStar);
      X.movie.children.newChildCallback.addCallback("foobar", spyName);

      // 2: TEST
      var child = {
        name: "foobar",
        _off: false
      };
      createjs.MovieClip.prototype._addManagedChild(child);

      // 3: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();

      // 4: TEST
      spyStar.calls.reset();
      spyName.calls.reset();
      // Add the same child again
      child._off = true;
      createjs.MovieClip.prototype._addManagedChild(child);

      // 5: ASSERT
      expect(spyStar).not.toHaveBeenCalled();
      expect(spyName).not.toHaveBeenCalled();

      // 6: TEST
      child._off = false;
      createjs.MovieClip.prototype._addManagedChild(child);

      // 5: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();
    });

    it("should continue to announce child even if it does not have an _off property", function() {
      // 1: SETUP
      var spyStar = jasmine.createSpy("newChildCallback.addCallback(*) result");
      var spyName = jasmine.createSpy(
        "newChildCallback.addCallback('name') result"
      );

      X.movie.children.newChildCallback.addCallback("*", spyStar);
      X.movie.children.newChildCallback.addCallback("foobar", spyName);

      // 2: TEST
      var child = {
        name: "foobar"
      };
      createjs.MovieClip.prototype._addManagedChild(child);

      // 3: ASSERT
      expect(spyStar).toHaveBeenCalled();
      expect(spyName).toHaveBeenCalled();
    });
  });
});
