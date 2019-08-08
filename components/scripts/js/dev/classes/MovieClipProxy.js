X.registerModule(
  "classes/MovieClipProxy",
  ["managers/classes"],
  function() {
    function MovieClipProxy(base) {
      this._original = base;
    }

    X.classes.register("MovieClipProxy", MovieClipProxy);

    MovieClipProxy.prototype = {
      get labels() {
        return this._original.timeline._labels;
      },

      hasLabel: function(labelName) {
        return this.labels.hasOwnProperty(labelName);
      },

      getLabelFrame: function(labelName) {
        return this.labels[labelName];
      },

      gotoAndStop: function(location) {
        this._original.gotoAndStop(location);
      },

      gotoAndPlay: function(location) {
        this._original.gotoAndPlay(location);
      },

      stop: function() {
        this._original.stop();
      },

      callOnNextTick: function(method) {
		  var that = this;
        function handler() {
          that._original.removeEventListener("tick", handler);
          method();
        }

        this._original.addEventListener("tick", handler);
      }
    };
  },
  "class"
);
