X.registerModule(
  "managers/loadQueue",
  ["managers/hook", "classes/Callback"],
  function() {
    var COMPLETE_TIMEOUT = 10;
    var queueCreated = false;

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

      // In projects with no sprite sheets a queue may not be created.
      queueCreated = true;

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

    X.addOneTimeHook(AdobeAn, "compositionLoaded", function() {
      // If this function has been called and no queue has been created.
      // Then we know there is no sprite sheet being loaded.
      // Therefore we consider the stage ready to play
      if (!queueCreated) {
        // Once compositionLoaded is run the main timeline symbol will not have been
        // added to the stage. However, once the function that called compositionLoaded
        // has finished running the symbol will have been added to the stage.
        // So we just wait for the next animation frame and then everything should be ready to go.
        requestAnimationFrame(function() {
          X.loadQueue.callback.sendToCallback("complete", null);
        });
      }
    });
  }
);
