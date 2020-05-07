X.registerModule(
  "managers/prefix/registerDisplayObjectNameAndSlideObjectData",
  ["managers/prefix/displayObjectName", "managers/utils"],
  function() {

    var indexAfter = function(character) {
      return X.utils.pipe(
        X.utils.indexOf(character),
        X.utils.add(1)
      );
    };
    var dropTo = function(character) {
      return X.utils.converge(X.utils.drop, [
        indexAfter(character),
        X.utils.identity
      ]);
    };

	  // We put the call to X.captivate.extra.dataManager.getSlideObjectDataByName
	  // inside here because if we're not in Captivate the 
	  // X.captivat.extra object will not be defined and will throw an error.
	  var getSlideObjectDataByName = function (name) {

	  	return X.captivate.extra.dataManager.getSlideObjectDataByName(name);

	  }

    var extractSlideObjectNameFromMovieClip = X.utils.pipe(
      // Movie clip object
      X.utils.prop("name"),
      // Movieclip name (xTextFromCaption_SmartShape_1)
      dropTo("_")
      // String (SmartShape_1)
    );

    var getSlideObjectDataFromMovieClipName = X.utils.pipe(
      // Movie Clip object
      extractSlideObjectNameFromMovieClip,
      // Name of slide object
      X.utils.whenAllParametersValid(getSlideObjectDataByName)
      // Slide Object Data
    );

    X.registerDisplayObjectNameAndSlideObjectData = function(prefix, callback) {
      // We're not going to attempt this unless we have a way of accessing
      // slide objects from CpExtra
      X.utils.when(X.captivate.hasCpExtra, function() {
        // This method will pass us any movieclip which wants to
        // connect to slide object data
        X.registerDisplayObjectNamePrefix(
          // For example: xTextFromCaption
          prefix,

          // The callback which will handle the movieclip
          X.utils.converge(X.utils.whenAllParametersValid(callback), [
          // X.utils.converge(console.log, [
            // First parameter of callback is the movie clip which has just been
            // passed to us from 'registerDisplayObjectNamePrefix'
            X.utils.identity,

            // Second parameter is slide object data
            getSlideObjectDataFromMovieClipName
          ])
        );
      })();
    };
  }
);
