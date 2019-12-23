/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule(
  "managers/movie/children",
  ["managers/hook", "managers/movie/rootTimeline", "managers/utils"],
  function() {
    "use strict";

    X.movie.children = {
      newChildCallback: new X.classes.Callback()
    };

    ////////////////////////////////////////
    ////// existingChildren functionality
    var existingChildren = {};

    /**
     * Adds display object to the existingChildren list
     */
    function addChildToList(child) {
      if (!existingChildren[child.name]) {
        existingChildren[child.name] = [];
      }
      existingChildren[child.name].push(child);
    }

    function removeChildFromList(child) {
      var list = existingChildren[child.name];
      if (!list) return;
      var index = list.indexOf(child);
      list.splice(index, 1);
    }

    var hasName = X.utils.pipe(
      X.utils.prop("name"),
      X.utils.isNotNil
    );

    var hasNoName = X.utils.complement(hasName);


    var isInList = function(child) {
      return X.utils.has(child, existingChildren[child.name]);
    };

    var isNotInList = X.utils.complement(isInList);


    var childShouldBeAnnounced = X.utils.allPass([
      hasName,
      X.utils.propEq("_off", false),
      isNotInList
    ]);

    var childShouldBeRemoved = X.utils.allPass([
      hasName,
      X.utils.propEq("_off", true),
      isInList
	]);

    var handleAnnoucement = X.utils.when(
      // predicate
      childShouldBeAnnounced,

      // method
      function(child) {
        addChildToList(child);
        X.movie.children.newChildCallback.sendToCallback(child.name, child);
        X.movie.children.newChildCallback.sendToCallback("*", child);
      }
    );

    var removeFromListIfOff = X.utils.when(
      // predicate
      childShouldBeRemoved,
      // method
      removeChildFromList
    );

    var handleNewChild = X.utils.pipe(
      X.utils.tap(handleAnnoucement),
      removeFromListIfOff
    );

    ////////////////////////////////////////
    ////// addChildAt latch

    // X.addHookAfter(createjs.MovieClip.prototype, "addChildAt", handleNewChild);
    X.addHookAfter(
      createjs.MovieClip.prototype,
      "_addManagedChild",
      handleNewChild
    );
  }
);
