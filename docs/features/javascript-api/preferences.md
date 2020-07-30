# X.preferences
This object many of the settings needed to configure CpMate to work just the way you want it.

## X.preferences.preview
Assign this the linkage name of a MovieClip in your library for CpMate to display that MovieClip when you test the movie.

The use of this only makes sense if you've already enabled [linkNameToLibrarySymbol](#x-preferences-linknametolibrarysymbol)

``` js
X.preferences.linkNameToLibrarySymbol = true;
X.preferences.preview = "animation_1";
```

[Learn more here](../building-animations/multiple-animations.html#previewing-animations-inside-movieclips)

## X.preferences.makeResponsive
When enabling [outerRendering](../building-animations/outer-rendering) or [custom stage sizes](../building-animations/custom=stage-size) certain publish settings in Adobe Animate will be overridden. One of them is the **make responsive checkbox**

IMAGE HERE

This preference essentially controls the setting of that checkbox. By default CpMate will set it to **true**, which is the same as checked. To 'uncheck', this box, write the following:

``` js
X.preferences.makeResponsive = false;
```

## X.preferences.responsiveDirections
``` js
X.preferences.responsiveDirections
```

## X.preferences.responsiveDirection
``` js
X.preferences.responsiveDirection
```

## X.preferences.scaleTypes
``` js
X.preferences.scaleTypes
```

## X.preferences.outerRendering
``` js
X.preferences.outerRendering
```

## X.preferences.stageWidth
``` js
X.preferences.stageWidth
```
## X.preferences.stageHeight
``` js
X.preferences.stageHeight
```
## X.preferences.useRAFTiming
``` js
X.preferences.useRAFTiming
```
## X.preferences.disableIFrameBorder
``` js
X.preferences.disableIFrameBorder
```

## X.preferences.linkNameToLibrarySymbol
``` js
X.preferences.linkNameToLibrarySymbol
```

## X.preferences.pausingInstanceSuffix
``` js
X.preferences.pausingInstanceSuffix
```
