X.registerModule(
  "managers/prefixes/registees/xBind",
  ["managers/prefix/displayObjectNameAndVariable"],
  function() {
    function xBind(movieClip, value) {
      var proxy = new X.classes.MovieClipProxy(movieClip);

	  // We do this to prevent the error where calling
	  // gotoAndStop too soon will cause the movie clip to play instead
	  // Weird, right?
      proxy.callOnNextTick(function() {
        // If the label is present
        if (proxy.hasLabel(value)) {
          var frame = proxy.getLabelFrame(value);

          proxy.gotoAndStop(frame);
        } else {
          // If there is no matching label, then stop at the first frame
          proxy.gotoAndStop(0);
        }
      });
    }

    // Register for updates
    X.registerDisplayObjectNamePrefixAndVariable("xBind", xBind);
  }
);
