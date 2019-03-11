X.registerModule("classes/DisplayObjectProxy", ["managers/classes"], function () {

	function invertProp(propName) {

		if (propName === "x") propName = "y"
		else if (propName === "y") propName = "x"
		else if (propName === "width") propName = "height"
		else if (propName === "height") propName = "width"
		return propName

	}		

	function DisplayObjectProxy(org) {
		this.original = org;
		this.bounds = org.getBounds();
		this.switchBoundsProps = org.rotation === 90 || org.rotation === -90;
	}

	DisplayObjectProxy.prototype = {
		getBoundsProp: function (propName) {

			if (this.switchBoundsProps) {

				propName = invertProp(propName);

			}

			return this.bounds[propName];
		},
		get x() {

			return this.original.x + this.getBoundsProp('x');

		},
		set x(val) {

			this.original.x = val - this.getBoundsProp('x');			
			
		},
		get y() {

			return this.original.y + this.getBoundsProp('y');			

		},
		set y(val) {

			this.original.y = val - this.getBoundsProp('y');			
			
		},
		get width() {

			return this.getBoundsProp('width');			

		},
		get height() {

			return this.getBoundsProp('height');			


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
	}

    X.classes.register("DisplayObjectProxy", DisplayObjectProxy);

}, "class");
