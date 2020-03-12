X.registerModule(
  "managers/preferences/debug",
  ["managers/preferences"],
  function() {

    X.preferences.define({
      name: "debug",
      animateRequired: true,
      method: function(enabled) {

        X.debugWindow.update({
          enabled: enabled
        });

      }
    });
  }
);
