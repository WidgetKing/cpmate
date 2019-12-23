X.registerModule(
  "managers/prefix/displayObjectName",
  ["managers/movie/children", "managers/utils"],
  function() {
    // Variables
    var callbacks = {};

    // Methods
    X.registerDisplayObjectNamePrefix = function(prefix, callback) {
      callbacks[prefix] = callback;
      callbacks[prefix.toLowerCase()] = callback;
    };

    X.movie.children.newChildCallback.addCallback("*", function(movieClip) {
      var name = movieClip.name;

      // Get prefix
      var prefix = name.split("_")[0];

      // If we have something registered for this prefix
      if (callbacks.hasOwnProperty(prefix)) {

        // Call the callback
        callbacks[prefix](movieClip);
      }
    });
  }
);
