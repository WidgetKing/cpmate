X.registerModule("preferences/size", ["managers/preferences", "elements/animate"], function () {

    function resizeCanvas() {
      if (X.resizeCanvas) X.resizeCanvas();
    }

	X.preferences.define({
		"name":"stageWidth",
		"animateRequired": false,
		"method": resizeCanvas,
		"default": null
	});

	X.preferences.define({
		"name":"stageHeight",
		"animateRequired": false,
		"method": resizeCanvas,
		"default": null
	});

	////////////////////////////////////////
	////// Set defaults
	
    X.animate.callWhenLoaded(function() {

		// We first check for null because the user may
		// have already set this value while we've been waiting
		// for the library to load.

		if (X.preferences.stageWidth === undefined) {
			X.preferences.stageWidth = X.animate.library.properties.width;
		}

		if (X.preferences.stageHeight === undefined) {
			X.preferences.stageHeight = X.animate.library.properties.height;
		}

	});
});
