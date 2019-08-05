X.registerModule(
  "managers/prefixes/registees/xPause",
  ["managers/prefix/displayObjectName"],
  function() {
    function xPause(movieClip, value) {

      X.movie.changeCallback.addCallback("play", function () {

      	movieClip.play();

      });

      X.movie.changeCallback.addCallback("stop", function () {

      	movieClip.stop();

      });

    }

    // Register for updates
    X.registerDisplayObjectNamePrefixAndVariable("xPause", xPause);
  }
);
