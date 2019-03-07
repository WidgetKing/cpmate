describe("classes/CallbackObject", () => {

  var instance;

  beforeEach(() => {

    window.X = {
      "classes":unitTests.classes
    };

    instance = new unitTests.classes.CallbackObject();

  });

  afterEach(() => {
    delete window.X;
  })

  it("should inform us when a property's value has changed", () => {
    // 1: SETUP
    var result,
        a = function (value) {
          result = value;
    }


    // 2: TEST
    instance.callback("foobar", a);
    instance.setProp("foobar", "scoobydoo");

    // 3: ASSERT
    expect(result).toBe("scoobydoo");

  });

  it("should allow us to access values inside object", () => {

    // 1: SETUP
    var result;

    // 2: TEST
    instance.setProp("foo", "bar");
    result = instance.getProp("foo");

    // 3: ASSERT
    expect(result).toBe("bar");

  });

  it("should allow us to detect whether a prop already exists", () => {

    // 1: SETUP
    instance.setProp("exists", true);

    // 2: TEST
    var hasExists = instance.hasProp("exists");
    var hasNonexistant = instance.hasProp("nonexistant");

    // 3: ASSERT
    expect(hasExists).toBe(true);
    expect(hasNonexistant).toBe(false);

  });

});
