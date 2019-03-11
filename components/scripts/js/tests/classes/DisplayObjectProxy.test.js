describe ("classes/DisplayObjectProxy", () => {

  beforeEach(() => {

    window.X = {
      "classes":unitTests.classes
    };

  });

	it("should give us a proxy to access parameters", () => {
		
		// 1: SETUP
		var data = {
			"x": 1,
			"y": 2,
			"rotation": 5,
			"getBounds": function () {
				return {
					"width": 3,
					"height": 4,
					"x":0,
					"y":0
				}
			}
		};

		var instance = new X.classes.DisplayObjectProxy(data);
		
		// 3: ASSERT
		expect(instance.x).toBe(1);
		expect(instance.y).toBe(2);
		expect(instance.width).toBe(3);
		expect(instance.height).toBe(4);
		expect(instance.rotation).toBe(5);
		
	});
	
	it("should return x and y adjusted to keep point always in top left", () => {
		
		// 1: SETUP
		var data = {
			"x": 10,
			"y": 10,
			"rotation": 0,
			"getBounds": function () {
				return {
					"width": 10,
					"height": 10,
					"x":-5,
					"y":-5
				}
			}
		};
		
		// 2: TEST
		var instance = new X.classes.DisplayObjectProxy(data);
		
		// 3: ASSERT
		expect(instance.x).toBe(5);
		expect(instance.y).toBe(5);
		
	});

	it("should adjust x/y/width/height for rotation", () => {
		
		// 1: SETUP
		var data = {
			"x": 100,
			"y": 100,
			"rotation": 90,
			"getBounds": function () {
				return {
					"width": 50,
					"height": 30,
					"x":-50,
					"y":-25
				}
			}
		};
		
		// 2: TEST
		var instance = new X.classes.DisplayObjectProxy(data);
		
		// 3: ASSERT
		expect(instance.width).toBe(30);
		expect(instance.height).toBe(50);
		expect(instance.x).toBe(75);
		expect(instance.y).toBe(50);
		
		
	});
	
	describe("primary", () => {

		it("should return our preset primary axis through primaryAxis and primaryLength", () => {
			
			// 1: SETUP
			var data = {
				"x": 1,
				"y": 2,
				"rotation": 0,
				"getBounds": function () {
					return {
						"width": 50,
						"height": 30,
						"x":0,
						"y":0
					}
				}
			};
			
			// 2: TEST
			var instance = new X.classes.DisplayObjectProxy(data);
			
			instance.primary = "x";
			
			// 3: ASSERT
			expect(instance.primaryAxis).toBe(1);
			expect(instance.primaryLength).toBe(50);
			
			instance.primaryAxis = 5;
			expect(instance.x).toBe(5);
		});
		
	});
});
