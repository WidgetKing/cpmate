/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule(
  "elements/animate",
  ["managers/loadQueue", "managers/hook"],
  function() {
    "use strict";

    ////////////////////////////////////////
    ////// END EXPERIMENT

    var callWhenLoadedList = [],
      waitingForAnimateLoadInterval;

    function isAnimateLoaded() {
      return window.stage;
    }

    function callCallWhenLoadedList() {
      callWhenLoadedList.forEach(function(method) {
        method();
      });

      callWhenLoadedList = null;
    }

    X.loadQueue.callback.addCallback("complete", callCallWhenLoadedList);

    ////////////////////////////////////////
    ////// X.animate object

    X.animate = {
      callWhenLoaded: function(method) {
        // Animate is loaded
        if (isAnimateLoaded()) {
          method();

          // Animate not yet loaded
          // Add to waiting list
        } else {
          callWhenLoadedList.push(method);
        }
      }
    };

    X.animate.callWhenLoaded(function() {
      X.animate.stage = stage;

      // Now that we have access to the stage it's important we add
      // support for touch events.
      // We put this code here rather than in another file because
      // the stage takes an arbitrary amount of time to load.
      // Therefore this is the safest place to put it.
      createjs.Touch.enable(X.animate.stage, true);

      X.animate.mainTimeline = stage.children[0];

      if (window.AdobeAn) {
        X.animate.library = AdobeAn.getComposition(
          AdobeAn.bootcompsLoaded[0]
        ).getLibrary();
      }

      // Now is the point where it is safe for the animation to play
      // dispatchAnimationReady();
    });

    /**
     * Dispatches the 'animationready' event on the window.
     *
     * Side Effects:
     *   - Accesses functions...
     *   - - X.event.newEvent
     *   - - window.dispatchEvent
     *   - Dispatches an event on the window object.
     *
     * @parmas None
     * @returns None
     */
    function dispatchAnimationReady() {
      if (X.captivate) {
        if (X.captivate.extra && X.captivate.extra.cpMate.notifyCpExtra) {
          X.captivate.extra.cpMate.notifyCpExtra(
            X.slideObject.name,
            "animationready"
          );
        }
      } else {
        console.log(
          "WARNING: Tried to send 'animationready' notification to CpExtra, " +
            "but the 'elements/captivate' module has not yet run"
        );
      }
      // var event = X.event.newEvent("animationready");
      // window.dispatchEvent(event);
    }

    X.loadQueue.callback.addCallback("readytoplay", dispatchAnimationReady);
  }
);
