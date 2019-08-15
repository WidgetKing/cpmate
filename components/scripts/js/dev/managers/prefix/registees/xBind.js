X.registerModule(
  "managers/prefixes/registees/xBind",
  ["managers/utils", "managers/prefix/displayObjectNameAndVariable"],
  function() {
    // The main business logic is here which works for
    // - xBind
    // - xBindStop
    // - xBindPlay
    function createBindHandler(methodName) {
      return function(movieClip, value) {
        var proxy = new X.classes.MovieClipProxy(movieClip);

        // If the label is present
        if (proxy.hasLabel(value)) {
          var frame = proxy.getLabelFrame(value);

          proxy[methodName](frame);
        } else {
          // If there is no matching label, then stop at the first frame
          proxy[methodName](0);
        }
      };
    }

    // We call the bind handler on next tick to prevent the error where calling
    // gotoAndStop too soon will cause the movie clip to play instead
    // Weird, right?
    var xBind = X.utils.onNextTick(createBindHandler("gotoAndStop"));
    var xBindPlay = createBindHandler("gotoAndPlay");

    // Register for updates
    X.registerDisplayObjectNamePrefixAndVariable("xBind", xBind);
    X.registerDisplayObjectNamePrefixAndVariable("xBindStop", xBind);

    // Register xBindPlay
    X.registerDisplayObjectNamePrefixAndVariable("xBindPlay", xBindPlay);
  }
);
