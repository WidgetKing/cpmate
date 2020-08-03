# Sliders

## Handle moving erratically
Have you ensured that:
1. The handle MovieClip's registration point is in the **center**.
2. The track MovieClip's registration point is in the **top left**.

If you're creating a vertical slider, when defining the slider did you state it was a vertical slider with the orientation setting?

```js
X.slider({
  track: this.track,
  handle: this.handle,
  variable: "myvar",

  orientation: "vertical"
});
```
