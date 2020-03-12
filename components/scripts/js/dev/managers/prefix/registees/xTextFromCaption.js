X.registerModule(
  "managers/prefixes/registees/xTextFromCaption",
  ["managers/utils", "managers/prefix/displayObjectNameAndVariable"],
  function() {
    var PREFIX = "xTextFromCaption";

    function xTextFromCaption(textField, slideObjectData) {
      var proxy = new X.classes.TextFieldProxy(textField);

      if (proxy.valid) {
        proxy.text = slideObjectData.text;
      } else {
        X.error("PR002", PREFIX, textField.name);
      }
    }

    // Register xTextFromCaption
    X.registerDisplayObjectNameAndSlideObjectData(PREFIX, xTextFromCaption);
  }
);
