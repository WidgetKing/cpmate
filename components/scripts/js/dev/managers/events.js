X.registerModule("managers/events", ["managers/mouseEvents"], function() {
  // We don't have to define the X.events object because
  // the managers/mouseEvents module is loaded first and it defines
  // the X.events object.
  // Yes, I know that it would be better for the events object to be created
  // in this file. Let's just wait and see if we need to add more code here

  /**
   * Creates an event object using the best method for the current browser.
   *
   * Is Pure.
   *
   * @param eventName The name of the event
   * @returns An event object that can be dispatched with {eventHandler}.dispatchEvent()
   */
  X.events.newEvent = function(eventName) {
    // Modern Browsers
    if (typeof Event === "function") {
      return new Event(eventName);

      // Internet explorer
    } else {
      var event = document.createEvent("Event");
      event.initEvent(eventName, true, true);
      return event;
    }
  };
});
