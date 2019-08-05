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
    ////// newChildCallback functionality
    var existingChildIds = {};

    X.addHookAfter(
      createjs.MovieClip.prototype,
      "addChildAt",
      X.utils.unless(
		  // predicate
        function(child) {
          return X.utils.has(child.id, existingChildIds) || X.utils.isNil(child.name)
        },

		  // method
        function(child) {
          existingChildIds[child.id] = true;

          X.movie.children.newChildCallback.sendToCallback(child.name, child);
          X.movie.children.newChildCallback.sendToCallback("*", child);
        }
      )
    );

  }
);
