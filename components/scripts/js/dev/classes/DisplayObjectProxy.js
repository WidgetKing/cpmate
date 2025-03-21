X.registerModule(
  "classes/DisplayObjectProxy",
  ["managers/classes"],
  function() {
    function invertProp(propName) {
      if (propName === "x") propName = "y";
      else if (propName === "y") propName = "x";
      else if (propName === "width") propName = "height";
      else if (propName === "height") propName = "width";
      return propName;
    }

    function DisplayObjectProxy(org) {
      this.original = org;
      this.switchBoundsProps = org.rotation === 90 || org.rotation === -90;
    }

    DisplayObjectProxy.prototype = {
      getBoundsProp: function(propName) {
        if (this.switchBoundsProps) {
          propName = invertProp(propName);
        }

        return this.bounds[propName];
      },

      // Usually we want to calculate width and height using getBoundsProp
      // This works for projects exporting everything to a spirite sheet
      // but for projects that export only to drawn graphics it will not give us
      // the height and width. Therefore, we fall back on this method
      // to read the graphics instructions and guess the width from that.
      calculateLength: function(index) {
        if (!this.original.shape && !this.original.shape.graphics) return 0;

        var min = 0;
        var max = 0;

        /*
         * Example instructions
         * [
         * {} // Begin path
         * {x: -203.9, y:19.5} // Move To
         * {x: -203.9, y:-19.5} // Line To
         * {x: 203.9, y:-19.5} // Line To
         * {x: 203.9, y:19.5} // Line To
         * {} // Close Path
         * {style: "#117E88", matix:undefined} // Fill
         * ]
         */
        this.original.shape.graphics._activeInstructions.forEach(function(
          instruction
        ) {
          // If contains no drawing information
          if (!instruction.hasOwnProperty(index)) return;

          min = Math.min(instruction[index], min);
          max = Math.max(instruction[index], max);
        });

        return Math.abs(max - min);
      },

      get bounds() {
        var bounds = this.original.getBounds();

        if (!bounds) {
          bounds = {
            x: this.original.x,
            y: this.original.y,
            width: 0,
            height: 0
          };
        }

        return bounds;
      },
      get x() {
        return this.original.x + this.getBoundsProp("x");
      },
      set x(val) {
        this.original.x = val - this.getBoundsProp("x");
      },
      get y() {
        return this.original.y + this.getBoundsProp("y");
      },
      set y(val) {
        this.original.y = val - this.getBoundsProp("y");
      },
      get width() {
        var value = this.getBoundsProp("width");
        if (value === 0) {
          value = this.calculateLength("x");
        }
        return value;
      },
      get height() {
        var value = this.getBoundsProp("height");
        if (value === 0) {
          value = this.calculateLength("y");
        }
        return value;
      },
      get rotation() {
        return this.original.rotation;
      },

      get primary() {
        return this._pa;
      },

      set primary(val) {
        this._pa = val;

        if (val === "x") {
          this._pl = "width";
        } else {
          this._pl = "height";
        }

        this._sl = invertProp(this._pl);
        this._sa = invertProp(this._pa);
      },

      get primaryAxis() {
        return this[this._pa];
      },

      set primaryAxis(val) {
        this[this._pa] = val;
      },

      get primaryLength() {
        return this[this._pl];
      },

      get secondaryAxis() {
        return this[this._sa];
      },
      set secondaryAxis(val) {
        this[this._sa] = val;
      },
      get secondaryLength() {
        return this[this._sl];
      }
    };

    X.classes.register("DisplayObjectProxy", DisplayObjectProxy);
  },
  "class"
);
