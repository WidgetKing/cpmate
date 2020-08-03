# Defining A Slider

To define a slider you must have:

1. A MovieClip for the slider's **handle**.
   - This symbol's registration point is expected to be positioned in it's **center**
2. A MovieClip for the slider's **track**
   - This symbol's registration point is expected to be positioned in the **top left**

::: warning Registration Points are Important
The slider will **not** work as expected if the registration points are not in their expected locations.

In a perfect world, CpExtra would be able to do some math to work out where the registration point is located within the shape and take that into account. However, Adobe Animate does not provide enough information for us to make that calculation. So, we have to work on the trust system.
:::

Both these MovieClips must:

- Be on the same timeline. They can't be spread across different symbol's timelines.
- Be visible at the same time. You can't have the track appear for frames 1 - 10 and the handle appear from frames 11 - 20.
- Have instance names. (For the rest of this page, we will assume you name the track **'track'** and the handle **'handle'**)

## The Javascript

In the timeline that houses the handle and track MovieClips, create a layer to hold your actions. At the point the handle and track are visible on stage, add a keyframe. It's in this keyframe we will include the javascript to define a slider.

We'll use the **X.slider()** method to define a slider. This function takes a single parameter: A javascript object which describes the slider.

To create a slider, three pieces of information are required:

- handle
- track
- variable

You could define the javascript object separate and pass it into the X.slider() function like so:

```js
var sliderData = {};

// Like we said above, we assume you've named the handle MovieClip 'handle'...
sliderData.handle = this.handle;
// ...and the track 'track'
sliderData.track = this.track;
sliderData.variable = "myVar";

X.slider(sliderData);
```

Or you can define the javascript object _as_ you pass it in to X.slider().

```js
X.slider({
  handle: this.handle,
  track: this.track,
  variable: "myVar"
});
```

Both these methods are fine. But nowadays most programmers prefer the second method. Therefore, for the rest of the help we will define the slider data object as we pass it in to X.slider().

If you test the Adobe Animate movie now, you should find the slider works!

### Captivate Variable
When you pull the Animate OAM into Captivate and publish, you will find when you move slider it will change the value of the slider.
By default CpMate will report the slider's location as between 0 and 100. For a horizontal slider, all the way to the left would be considered 0, while all the way to the right would be considered 100.

You can change the value of the Captivate variable to update the slider's location. For example, if the handle is presently all the way to the left, Captivate can change the variable's value to 100 to move it all the way to the right.

You can change the 0 - 100 range using the **Min and Max** parameters discussed below.

::: note Multiple sliders, one variable
You can connect multiple sliders to the same Captivate Variable. Updating the Captivate Variable will change the location of both sliders. Also, dragging one slider will automatically move the other slider to match.
:::

## Extra Parameters

CpMate provides a number of optional, but useful parameters.

### Orientation

By default, CpMate will assume you're making a **horizontal** slider. If, however, you are making a vertical slider, you will need to state that explicitly with the **orientation** parameter.

```js
X.slider({
  handle: this.handle,
  track: this.track,
  variable: "myVar",

  // For an up and down slider
  orientation: "vertical"

  // To explicitly state a left to right slider
  // orientation: "horizontal"
});
```

### Min and Max
When CpMate reports the slider's position to the linked Captivate Variable, it will report it in a range between 0 and 100.

You can change this range using the min and max parameters. For example, the above code will report the slider's position in a range between 1 and 10.

```js
X.slider({
  handle: this.handle,
  track: this.track,
  variable: "myVar",

  min: 1,
  max: 10
});
```
