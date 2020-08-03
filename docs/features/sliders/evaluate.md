# Evaluate
If you're using sliders to allow learners to input an answer, you will need to:
1. Determine when the learner is ready to submit their answer.
2. Take action in accord with their answer.

This is all part of **evaluation**. The slider data object has a property called 'evaluate'. This requires more information than a single parameter can handle, so the evaluate property will hold another object with parameters for each important piece of information.

```js
X.slider({
  track: this.track,
  handle: this.handle,
  variable: "myVar",
  evaluate: {
	  // Our settings for evaluation
  }
});
```

## On
The on property allows us to specify **when** evaluation happens. We have several options.

### Continually
This setting will mean 

```js
X.slider({
  track: this.track,
  handle: this.handle,
  variable: "myVar",
  evaluate: {
	  on: "continually"

	  // Criteria settings here...
  }
});
```
### Mouse Up

### Button
Let's say 
- Continually
- Mouse Up
- Button

```js
X.slider({
  track: this.track,
  handle: this.handle,
  variable: "myvar",
  evaluate: {
    on: "button",
    button: this.submitbutton,
    criteria: [
      {
        if: "default",
        then: "HAN_default_action" // Name of interactive object in Captivate whose success action we'll use
      },
      {
        if: "10-15, 21, 30-60",
        then: function() {
          some_variable = true;
          return "HAN_success_action"; // This action will be called
        }
      },
      {
        if: 20,
        then: false // Do nothing
      }
    ]
  }
});
```
