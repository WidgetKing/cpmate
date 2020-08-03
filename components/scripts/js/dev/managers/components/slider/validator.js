X.registerModule("managers/components/slider/validator", ["managers/utils"], function () {

  /**
   * @module X.slider()
   *
   * Creates a slider interaction out of items MovieClips on the stage.
   *
   *
   * @param {Object} data - (required) A JSON object which provides the settings
   * @param {string} data.variable - (required) The Captivate Variable to which the slider will be bound
   * @param {number} data.min - The minimum value of the Captivate Variable. Equates to the lowest point of the slider.
   * @param {number} data.max - The maximum value of the Captivate Variable. Equates to the highest point of the slider.
   * @param {boolean} data.reverse - Indicates whether the location of the slider handle and the value it sends to the Captivate variable needs to have its min/max inverted.
   * @param {string} data.orientation - Either 'vertical' or 'horizontal'. Defines what direction the slider slides in.
   * @param {MovieClip} data.track - Instance of MovieClip on stage to act as slider track
   * @param {MovieClip} data.handle - Instance of MovieClip on stage to act as slider handle
   * @param {MovieClip} data.scrollUp - Instance of MovieClip on stage to act as up scroll arrow
   * @param {MovieClip} data.scrollDown - Instance of MovieClip on stage to act as down scroll arrow
   * @param {string} data.attachedItems - @syntax query of instances names to attach themselves to the handle and move with it
   * @param {boolean} data.trackClicking - Indicates whether a click on the track should move the handle to that location
   * @param {boolean} data.hideTrack - Indicates whether the track MovieClip should be hidden at runtime
   * @param {number} data.throwingFriction - If 0 there is no throwing. Otherwise, defines how quickly slider should come to a stop
   * @param {boolean} data.handCursor - Indicates whether a hand cursor should be shown over handle and track.
   * @param {boolean} data.scroll - Indicates whether should react to mouse wheel scroll.
   * @param {boolean} data.scrollWhenOver - Indicates whether should react to mouse wheel scroll when mouse is located on top of handle and track.
   * @param {boolean} data.scrollStep - Indicates how much the variable should be changed by for each step of the scroll wheel.
   * @param {Object} data.evaluate - Settings for slider evaluation (See the evaluate module for more details)
   * @return {null}
   */
  X.slider = function (data) {

    function init() {

      if (!isValid()) {
        return;
      }

      var safeData = defaultedData();

      wireUpMVC(safeData);

    }

    function isValid() {
      var missingProps = X.utils.getMissingProps(["variable", "handle", "track"], data);

      if (missingProps.length > 0) {

        X.utils.forEach(missingProps, function (propName) {
          X.error("CE001", propName);
        });

        return false;
      }

      return true;
    }


    function defaultedData() {
      return X.utils.defaultTo({
            "min": 0,
            "max": 100,
            "reverse": false,
			// "orientation": "vertical",
			"orientation": "horizontal",
            "hideTrack": false,
            "scrollUp": null,
            "scrollDown": null,
            "attachedItems": null,
            "trackClicking": false,
            "throwingFriction": 0,
            "handCursor": true,
            "scrollWhenOver": false,
            "scroll": false,
            "scrollStep": 10
      }, data);

    }

    function wireUpMVC(data) {

      var model = X.slider.model(data);
      var view = X.slider.view(data);
      X.slider.controller(view, model, data);
      model.updateTo(view.update);

    }
	
    // Return to entry point
    init();

  }

});
