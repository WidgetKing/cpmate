describe("classes/MovieClipProxy", function () {
	
	var instance;
	var movieClipMock;

	function getInstance () {

		return new unitTests.classes.MovieClipProxy(movieClipMock);

	}
	

	beforeEach(function () {

		movieClipMock = {
			"timeline": {
				"_labels":{
					"first":0,
					"second":1,
					"third":2
				}
			},
			"gotoAndStop": jasmine.createSpy("movieClipMock.gotoAndStop()")
		};

	});

	it("should allow us to instantiate", function () {

		// 1: SETUP
		// 2: TEST
		// 3: ASSERT
		expect(getInstance).not.toThrow();

	});

	describe(".labels", function () {
		
		it("should give us access to labels object", function () {

			// 1: SETUP
			

			// 2: TEST
			var instance = getInstance();

			// 3: ASSERT
			expect(instance.labels).toEqual(movieClipMock.timeline._labels);
			

		});
		
	});


	describe(".hasLabel()", function () {
		
		it("should return true/false as to whether the movie clip has this label", function () {

			// 1: SETUP
			movieClipMock.timeline._labels.real = "hello";
			delete movieClipMock.timeline._labels.unreal;

			// 2: TEST
			var instance = getInstance();

			// 3: ASSERT
			expect(instance.hasLabel("real")).toEqual(true);
			expect(instance.hasLabel("unreal")).toEqual(false);
			

		});
		
	});

	describe(".getLabelFrame()", function () {
		
		it("should return us the frame number that a label is associated with", function () {

			// 1: SETUP
			var frameNumber = 10;

			movieClipMock.timeline._labels.real = frameNumber;
			delete movieClipMock.timeline._labels.unreal;

			// 2: TEST
			var instance = getInstance();

			// 3: ASSERT
			expect(instance.getLabelFrame("real")).toEqual(frameNumber);
			expect(instance.getLabelFrame("unreal")).toEqual(undefined);
			

		});
		
	});

	describe(".gotoAndStop()", function () {
		
		it("proxy the native gotoAndStop() method", function () {

			// 1: SETUP
			var instance = getInstance();

			// 2: TEST
			instance.gotoAndStop("position");

			// 3: ASSERT
			expect(movieClipMock.gotoAndStop).toHaveBeenCalledWith("position");

		});
		
	});
});
