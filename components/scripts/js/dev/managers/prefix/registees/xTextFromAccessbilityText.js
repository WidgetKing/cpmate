X.registerModule(
  "managers/prefixes/registees/xTextFromAccessibilityText",
  ["managers/utils", "managers/prefix/displayObjectNameAndVariable"],
  function() {
    var PREFIX = "xTextFromAccessibilityText";

    function xTextFromAccessbilityText(textField, slideObjectData) {
	  console.log(slideObjectData);
      var proxy = new X.classes.TextFieldProxy(textField);

      if (proxy.valid) {
        proxy.text = slideObjectData.accessibilityText;
		  console.log(proxy.text);
      } else {
        X.error("PR002", PREFIX, textField.name);
      }
    }

    // Register xTextFromAccessbilityText
    X.registerDisplayObjectNameAndSlideObjectData(PREFIX, xTextFromAccessbilityText);
  }
);
