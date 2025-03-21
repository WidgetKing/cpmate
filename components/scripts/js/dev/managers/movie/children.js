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

    var hasName = X.utils.pipe(X.utils.prop("name"), X.utils.isNotNil);

    var isInList = function(child) {
      return X.utils.has(child, existingChildren[child.name]);
    };

    var isNotInList = X.utils.complement(isInList);

    var isNotOff = X.utils.either(
      X.utils.hasnt("_off"),

      // DO NOT CHANGE THIS TO propEq("_off", false)
      // Sometimes _off can equal 'null'.
      // The movie clip is only considered 'off' when
      // this property is set to true.
      X.utils.propNotEq("_off", true)
    );

    var isOff = X.utils.complement(isNotOff);

    var childShouldBeAnnounced = X.utils.allPass([
      // If child doesn't have a name, then it won't have a prefix such as xBind
      // that we are interested in. We can skip it.
      hasName,

      // The ._off property indicates whether the item is meant to appear on stage.
      // We don't want to announce the object if it's not officially added to the stage yet.
      isNotOff,

      // We maintain a list of objects that have already been announced.
      // If this is one of those items, then stop here
      isNotInList
    ]);

    var childShouldBeRemoved = X.utils.allPass([hasName, isOff, isInList]);

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

    X.addHookAfter(
      createjs.MovieClip.prototype,
      "_addManagedChild",
      handleNewChild
    );
  }
);
