X.registerModule(
  "preferences/publishSettings",
  ["managers/preferences"],
  function() {
    ////////////////////////////////////////
    ////////// OBJECTS
    ////////////////////////////////////////
    var responsiveDirections = {
      BOTH: "both",
      WIDTH: "width",
      HEIGHT: "height"
    };

    var scaleTypes = {
      FIT_IN_VIEW: 1,
      STRETCH_TO_FIT: 2
    };

    function resizeCanvas() {
      if (X.resizeCanvas) X.resizeCanvas();
    }

    ////////////////////////////////////////
    ////////// Add preferences
    ////////////////////////////////////////

    ////////////////////////////////////////
    ////// Make responsive

    /**
     * Boolean
     *
     * @default true
     */
    X.preferences.define({
      name: "makeResponsive",
      animateRequired: false,
      method: resizeCanvas,
      default: true
    });

    ////////////////////////////////////////
    ////// Responsive direction

    X.preferences.define({
      name: "responsiveDirections",
      animateRequired: false,
      method: function(value) {},
      default: responsiveDirections
    });

    X.preferences.define({
      name: "responsiveDirection",
      animateRequired: false,
      method: resizeCanvas,
      default: responsiveDirections.BOTH
    });

    ////////////////////////////////////////
    ////// Scale types

    X.preferences.define({
      name: "scaleTypes",
      animateRequired: false,
      method: function(value) {},
      default: scaleTypes
    });
    /**
     * Assign with either X.preferences.scaleTypes.FIT_IN_VIEW
     * Or X.preferences.scaleTypes.STRETCH_TO_FIT
     *
     */
    X.preferences.define({
      name: "scaleType",
      animateRequired: false,
      method: resizeCanvas,
      default: scaleTypes.FIT_IN_VIEW
    });

    ////////////////////////////////////////
    ////// outerRendering

    /**
     * Boolean
     *
     * @default true
     */
    X.preferences.define({
      name: "outerRendering",
      animateRequired: false,
      method: resizeCanvas,
      default: false
    });

  }
);
