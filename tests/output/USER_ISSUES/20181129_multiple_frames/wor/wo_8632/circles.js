(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


// symbols:



(lib.squares = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"1":0,"2":4,"3":9});

	// timeline functions:
	this.frame_3 = function() {
		this.stop();
	}
	this.frame_8 = function() {
		this.stop();
	}
	this.frame_14 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(3).call(this.frame_3).wait(5).call(this.frame_8).wait(6).call(this.frame_14).wait(1));

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#33B3BE").s().p("A5dZeMAAAgy7MAy7AAAMAAAAy7g");
	this.shape.setTransform(163,163);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("A5dZeMAAAgy7MAy7AAAMAAAAy7g");
	this.shape_1.setTransform(163,163);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFF00").s().p("A5dZeMAAAgy7MAy7AAAMAAAAy7g");
	this.shape_2.setTransform(163,163);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},4).to({state:[{t:this.shape_2}]},5).wait(6));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,326,326);


(lib.circles_1 = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{"1":0,"2":4,"3":9});

	// timeline functions:
	this.frame_3 = function() {
		this.stop();
	}
	this.frame_8 = function() {
		this.stop();
	}
	this.frame_14 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(3).call(this.frame_3).wait(5).call(this.frame_8).wait(6).call(this.frame_14).wait(1));

	// Layer_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#33B3BE").s().p("A2EWGQpLpKAAs8QAAkUBDj6QCCnyGGmFQJJpKM7AAQM8AAJKJKQJKJKAAM7QAAM8pKJKQhWBWhbBJQoSGrrDAAQs7AApJpKg");
	this.shape.setTransform(200,200);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("A2EWGQpLpKAAs8QAAkUBDj6QCCnyGGmFQJJpKM7AAQM8AAJKJKQJKJKAAM7QAAM8pKJKQhWBWhbBJQoSGrrDAAQs7AApJpKg");
	this.shape_1.setTransform(200,200);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFF00").s().p("A2EWGQpLpKAAs8QAAkUBDj6QCCnyGGmFQJJpKM7AAQM8AAJKJKQJKJKAAM7QAAM8pKJKQhWBWhbBJQoSGrrDAAQs7AApJpKg");
	this.shape_2.setTransform(200,200);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},4).to({state:[{t:this.shape_2}]},5).wait(6));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,400,400);


// stage content:
(lib.circles = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		X.preferences.linkNameToLibrarySymbol = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;
// library properties:
lib.properties = {
	id: '3A3C5E15DE83EC4089AF958F66A01EC5',
	width: 400,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['3A3C5E15DE83EC4089AF958F66A01EC5'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;