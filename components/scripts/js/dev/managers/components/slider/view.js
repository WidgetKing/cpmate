X.registerModule("managers/components/slider/view", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.view = function (initialData) {

    /////////////////////////////
    ////////// EXPORTS

    var exports = {
	   "track": initialData.track,
	   "handle": initialData.handle,
       "listenToTrack": function (event, handler) {
		 initialData.track.addEventListener(event, handler)
       },
	   "listenToHandle":function (event, handler) {
		 initialData.handle.addEventListener(event, handler)
	   },
      "update": function () {
          
      }
    };


    return exports;
  }

});
