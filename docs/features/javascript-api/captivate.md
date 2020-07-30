# X.captivate
This object will always be available **even if not loaded in Captivate**. So if you're trying to detect if the animate document is in Captivate...

``` js
// Don't write this
// if (X.captivate) {
//	
//}

// Write this
if (X.captivate.isLoaded()) {
	// Yay! Safe to run code that should only run when loaded into Captivate.
} 
```
## X.captivate.variables

Gives access to all Captivate Variables. When the OAM is being run outside of Captivate this object will still exist and you can create variables on it.

``` js
// To read a Captivate Variable
var value = X.captivate.variables.CPVAR_1;

// To write to a Captivate Variable
X.captivate.variables.CPVAR_2 = value;
```

::: tip
Remember, you can access ALL Captivate variables. Including all CpExtra command variables defined in your project.
Want to trigger a Captivate Advanced Action from within your animation? Use CpExtra's xcmndCallActionOn
``` js
X.captivate.variables.xcmndCallActionOn = "Button_1"
```
:::


## X.captivate.isLoaded()
Returns true or false depending on whether the OAM has been loaded into Captivate.

``` js
var isInCaptivate = X.captivate.isLoaded()

if (isInCaptivate) {
	// Yay! Safe to run code that should only run when loaded into Captivate.
} else {
	// We must be previewing in Animate. Run some preview code here.
}
```

## X.captivate.hasCpExtra()
Returns true if Captivate has CpExtra. Returns false if it does not.

If Captivate does not have CpExtra then CpMate features will not work.

``` js
if (X.captivate.isLoaded() &&
	!X.captivate.hasCpExtra()) {
	
	alert("This ain't good");

}
```

## X.captivate.window
Gives you access to the window object of the Captivate HTML page.

``` js
X.captivate.window.alert("Sending a message using Captivate's custom alert box");
```

It's times when you use this that you REALLY want to be testing in a localhost server.

## X.captivate.extra
Gives access to the internal CpExtra managers and functions.

**HERE BE DRAGONS**
