X.registerModule(
  "managers/prefixes/registees/xTextFromVariable",
  ["managers/utils", "managers/prefix/displayObjectNameAndVariable"],
  function() {
    var PREFIX = "xTextFromVariable";

    function xTextFromVariable(textField, value) {

      var proxy = new X.classes.TextFieldProxy(textField);

      if (proxy.valid) {
        proxy.text = value;
      } else {
        X.error("PR002", PREFIX, textField.name);
      }
    }

    // Register xTextFromVariable
    X.registerDisplayObjectNamePrefixAndVariable(PREFIX, xTextFromVariable);
  }
);
