X.registerModule(
  "managers/loadQueue",
  ["managers/hook", "classes/Callback"],
  function() {
    var COMPLETE_TIMEOUT = 10;

    X.loadQueue = {
      callback: new X.classes.Callback()
    };

    function loadManifestHook() {
      var queue = this;

      ////////////////////////////////////////
      ////// Loading progress handlers
      function onComplete(event) {
        // We'll give a little extra time to allow animate to set up
        // As sometimes we still end up skipping the start of an animation
        window.setTimeout(function() {
          X.loadQueue.callback.sendToCallback("complete", queue);
        }, COMPLETE_TIMEOUT);
      }

      function onFileLoad() {
        X.loadQueue.callback.sendToCallback("fileload", queue);
      }

      function onError(error) {
        X.loadQueue.callback.sendToCallback("error", error);
        alert(error.title +  "\nFailed to load Animate Sprite Sheet: " + error.data.id);
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
