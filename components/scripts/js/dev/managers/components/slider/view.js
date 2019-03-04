X.registerModule("managers/components/slider/view", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.view = function (initialData) {

    /////////////////////////////
    ////////// EXPORTS

    var exports = {
      "listenToTrack": initialData.track.addEventListener,
      "listenToHandle": initialData.handle.addEventListener,
      "update": function () {
          
      }
    };


    return exports;
  }

});
