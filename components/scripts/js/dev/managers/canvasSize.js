// The stage resize code from animate plus a couple of additions I've
// made to make it run correctly
//
// TODO: Find a way to edit this so the overflow is rendered too.

X.registerModule(
  "managers/canvasSize",
  ["preferences/size", "elements/animate", "managers/utils"],
  function() {
    ////////////////////////////////////////
    ////////// Begin
    ////////////////////////////////////////
    var internalResizeCanvas;
    var alreadyWaitingForCanvasResize = false;

    ////////////////////////////////////////
    ////// private methods
    var triggerResizeOnNextTick = X.utils.onNextTick(function() {
      alreadyWaitingForCanvasResize = false;
      internalResizeCanvas();
    });

    ////////////////////////////////////////
    ////// Public methods

    X.resizeCanvas = function() {
      if (!alreadyWaitingForCanvasResize) {
        alreadyWaitingForCanvasResize = true;
        triggerResizeOnNextTick();
      }
    };

    ////////////////////////////////////////
    ////////// Calculate canvas width
    ////////////////////////////////////////

    X.animate.callWhenLoaded(function() {
      var domContainers = [
        document.getElementById("canvas"),
        document.getElementById("animation_container"),
        document.getElementById("dom_overlay_container")
      ];

      var lastW,
        lastH,
        lastS = 1,
        lib = X.animate.library;

      internalResizeCanvas = function(e) {
        if (e) e.preventDefault();

        // Render according to user's current settings for stageWidth and stageHeight
        // Which might not bare any relation to the actual stage height or stage width
        // due to outerRendering.
        var originalW = X.preferences.stageWidth;
        var originalH = X.preferences.stageHeight;
        // The width of stage in pixels (example: 958)
        var iw = window.innerWidth,
          // The height of stage in pixels (example: 574)
          ih = window.innerHeight;

        // If device displays more pixels in a pixel space due to
        // 'retina' screens. (example: 1) No retina.
        var pRatio = window.devicePixelRatio || 1,
          // On the canvas, how many real pixels would be needed
          // to simulate a canvas pixel if this was stretched out
          // according to width
          // (example: 2.395)
          xRatio = iw / originalW,
          // On the canvas, how many real pixels would be needed
          // to simulate a canvas pixel if this was stretched out
          // according to height
          // (example: 0.7175)
          yRatio = ih / originalH,
          // A temp variable which will either hold the value of xRatio
          // or yRatio depending on which one should be used based
          // on the users publish settings.
          sRatio = 1;

        // Publish Settings > Javascript > Basic > Make Responsive
        // Example: true
        if (X.preferences.makeResponsive) {
          // THE FOLLOWING IF BLOCK
          // Is purely to calculate what sRatio should equal

          // If the screen size has not changed since last time
          if (
            (X.preferences.responsiveDirection ==
              X.preferences.responsiveDirections.WIDTH &&
              lastW == iw) ||
            (X.preferences.responsiveDirection ==
              X.preferences.responsiveDirections.HEIGHT &&
              lastH == ih)
          ) {
            sRatio = lastS;

            // If we have not checked Scale to Visible Area
            // } else if (!isScale) {
            //   if (iw < originalW || ih < originalH)
            //     sRatio = Math.min(xRatio, yRatio);

            // This is what runs in our example
          } else if (
            X.preferences.scaleType == X.preferences.scaleTypes.FIT_IN_VIEW
          ) {
            sRatio = Math.min(xRatio, yRatio);

            // Unknown setting
          } else if (scaleType == X.preferences.scaleTypes.STRETCH_TO_FIT) {
            sRatio = Math.max(xRatio, yRatio);
          } else {
            if (iw < originalW || ih < originalH)
              sRatio = Math.min(xRatio, yRatio);
          }
        }

        // Example: sRatio equals yRatio which is 0.7175

        ////////////////////////////////////////
        ////////// MY CALCULATION OF STAGE SIZE
        ////////////////////////////////////////

        if (X.preferences.outerRendering) {

          // WIDTH
          if (sRatio === xRatio) {

			  // You may be looking at this code and wondering why we never reference
			  // pRatio which allows us to compensate for retina screens.
			  // Well it seems this part of the code doesn't really need to deal with that.
			  // Other parts will, but this part is safe.
            lib.properties.width = originalW;
            lib.properties.height = ih / sRatio;

            // HEIGHT
          } else if (sRatio === yRatio) {
            lib.properties.width = iw / sRatio;
            lib.properties.height = originalH;

            // Not responsive
          } else {
            lib.properties.width = originalW;
            lib.properties.height = originalH;

            console.log(
              "To use X.properties.outerRendering you must also enable Make Responsive under Publish Settings"
            );
          }

          ////////////////////////////////////////
          ////// Reposistion stage in center
          if (X.preferences.linkNameToLibrarySymbol) {

            var timeline = X.movie.rootTimeline.get();
            timeline.y = lib.properties.height / 2 - originalH / 2;
            timeline.x = lib.properties.width / 2 - originalW / 2;

          }

			// If this has been enabled and then disabled
        } else {
            lib.properties.width = originalW;
            lib.properties.height = originalH;
            var timeline = X.movie.rootTimeline.get();
            timeline.y = 0;
            timeline.x = 0;
		}

        // The width of the stage (example: 400)
        var w = lib.properties.width,
          // The height of the stage (example: 800)
          h = lib.properties.height;
        ////////////////////////////////////////
        ////////// THE MEAT AND POTATOES
        ////////////////////////////////////////

        // stage width * retina screen modifier * axis ratio
        // (400 * 1 * 0.7175) = 287
        domContainers[0].width = w * pRatio * sRatio;
        // stage height * retina screen modifier * axis ratio
        // (800 * 1 * 0.7175) = 574
        domContainers[0].height = h * pRatio * sRatio;

        domContainers.forEach(function(container) {
          container.style.width = w * sRatio + "px";
          container.style.height = h * sRatio + "px";
        });

        // Set scale in consideration of retina displays
        stage.scaleX = pRatio * sRatio;
        stage.scaleY = pRatio * sRatio;

        // Setting up for next time this function runs
        lastW = iw;
        lastH = ih;
        lastS = sRatio;

        // Redraw stage
        stage.tickOnUpdate = false;
        stage.update();
        stage.tickOnUpdate = true;
      };

      window.addEventListener("resize", internalResizeCanvas, true);
      internalResizeCanvas();
    });
  }
);
