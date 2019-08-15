X.registerModule(
  "classes/TextFieldProxy",
  ["managers/classes"],
  function() {
    function TextFieldProxy(base) {
      this._original = base;
    }

    X.classes.register("TextFieldProxy", TextFieldProxy);

    TextFieldProxy.prototype = {
      get text() {
        return this._original.text;
      },

      set text(value) {
        this._original.text = value;
      },

      get valid() {
        return this._original.constructor === createjs.Text;
      }
    };
  },
  "class"
);
