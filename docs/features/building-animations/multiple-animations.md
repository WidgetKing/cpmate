# Multiple Animations in One Project
Captivate projects typically will need multiple animations spread out on different slides. CpMate allows you to include all animations for different slides in a single Adobe Animate project.

By default this feature is not enabled. It can be enabled by doing the following:

1. In Adobe Animate, go to the main timeline.
2. Create a layer called **Actions** and select the first frame.
3. Open the Actions panel by going to Window > Actions (or press F9)
4. Enter the following code:

```
X.preferences.linkNameToLibrarySymbol = true;
```

From this point on, CpMate will **not expect you to include any animation on the Animate Main Timeline**. Instead, it will expect you to place your animation within MovieClip symbols. If everything is set up correctly, CpMate will know which of these animations you want to play, and will pull it out of the library and display it on stage.

## Setting up Animate For Multiple Animations


```
X.preferences.preview = "animation_1";
```
