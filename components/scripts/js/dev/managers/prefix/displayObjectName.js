X.registerModule(
  "managers/prefix/displayObjectName",
  ["managers/movie/children", "managers/utils"],
  function() {
    // Variables
    var callbacks = {};
    var alreadyCalledBack = {};

    // Methods
    X.registerDisplayObjectNamePrefix = function(prefix, callback) {
      callbacks[prefix] = callback;
      callbacks[prefix.toLowerCase()] = callback;
    };

    X.movie.children.newChildCallback.addCallback("*", function(movieClip) {
      var name = movieClip.name;

      // If we have already called a callback because of this
      // movie clip, then we should not continue
      if (alreadyCalledBack[name] === movieClip) {
        return;
      }

      // Get prefix
      var prefix = name.split("_")[0];

      // If we have something registered for this prefix
      if (callbacks.hasOwnProperty(prefix)) {
        // Make a note in the alreadyCalledBack list
        // so we don't call this again
        alreadyCalledBack[name] = movieClip;

        // Call the callback
        callbacks[prefix](movieClip);
      }
    });
  }
);
