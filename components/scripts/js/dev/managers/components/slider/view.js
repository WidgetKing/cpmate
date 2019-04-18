X.registerModule(
  "managers/components/slider/view",
  ["managers/utils", "managers/components/slider/validator"],
  function() {
    X.slider.view = function(initialData) {
      /////////////////////////////
      ////////// PRIVATE VARS
      var handle = initialData.handle;
      var track = initialData.track;
      var handleProxy = new X.classes.DisplayObjectProxy(handle);
      var trackProxy = new X.classes.DisplayObjectProxy(track);

      var orientation = getOrientation();
      var primaryAxis = orientation === "v" ? "y" : "x";

      handleProxy.primary = primaryAxis;
      trackProxy.primary = primaryAxis;

      /////////////////////////////
      ////////// ENTRY POINT
      function init() {
        alignHandleToTrack();
      }

      function getOrientation() {
        if (initialData.orientation === "vertical") {
          return "v";
        } else {
          return "h";
        }
      }

      /////////////////////////////
      ////////// ALIGN

      function alignHandleToTrack() {
        // align primary axises at '0' point.
        handleProxy.primaryAxis = trackProxy.primaryAxis;

        // center on secondary axis
        handleProxy.secondaryAxis =
          trackProxy.secondaryAxis +
          (trackProxy.secondaryLength - handleProxy.secondaryLength) / 2;
      }

      init();
      /////////////////////////////
      ////////// EXPORTS

      var exports = {
        track: initialData.track,
        handle: initialData.handle,
        listenToTrack: function(event, handler) {
          initialData.track.addEventListener(event, handler);
        },
        listenToHandle: function(event, handler) {
          initialData.handle.addEventListener(event, handler);
        },
        update: function(data) {
          handleProxy.primaryAxis = data.handlePosition;
        }
      };

      return exports;
    };
  }
);
