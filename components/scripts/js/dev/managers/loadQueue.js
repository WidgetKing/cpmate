X.registerModule(
  "managers/loadQueue",
  ["managers/hook", "classes/Callback"],
  function() {
    var COMPLETE_TIMEOUT = 10;

    X.loadQueue = {
      callback: new X.classes.Callback()
    };

    X.addOneTimeHook(
      createjs.MovieClip.prototype,
      "_updateTimeline",
      function() {
        X.loadQueue.callback.sendToCallback("readytoplay", null);
      }
    );

    function loadManifestHook() {
      var queue = this;

      ////////////////////////////////////////
      ////// Loading progress handlers
      function onComplete(event) {
        X.loadQueue.callback.sendToCallback("complete", queue);
      }

      function onFileLoad() {
        X.loadQueue.callback.sendToCallback("fileload", queue);
      }

      function onError(error) {
        X.loadQueue.callback.sendToCallback("error", error);
        console.error(
          error.title +
            "\nFailed to load Animate Sprite Sheet: " +
            error.data.id
        );
      }

      ////////////////////////////////////////
      ////// Add listeners

      queue.on("complete", onComplete);
      queue.on("fileload", onFileLoad);
      queue.on("error", onError);
    }

    X.addOneTimeHook(
      createjs.LoadQueue.prototype,
      "loadManifest",
      loadManifestHook
    );
  }
);
