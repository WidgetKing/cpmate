X.registerModule("classes/MovieClipProxy", ["managers/classes"], function () {
	
	function MovieClipProxy (base) {

		this._original = base;

	}
	

	X.classes.register("MovieClipProxy", MovieClipProxy);


	MovieClipProxy.prototype = {
		get labels() {

			return this._original.timeline._labels;

		},

		hasLabel: function (labelName) {
			return this.labels.hasOwnProperty(labelName);
		},

		getLabelFrame: function (labelName) {
			return this.labels[labelName];
		},

		gotoAndStop: function (location) {

			this._original.gotoAndStop(location);

		}
	};


}, "class");
