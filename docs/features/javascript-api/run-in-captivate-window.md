# X.runInCaptivateWindow()
Are you a Javascript developer? Are you looking for an easy way to run your Javascript code in Captivate and update it easily?

Is X.runInCaptivateWindow() is the function for you.

Convert any code that you have to a string and then pass it into X.runInCaptivateWindow. CpMate will then pass it up to the Captivate window to be executed there.

``` js
X.runInCaptivateWindow("alert('Captivate code here!')");
```

If you are handy with javascript workflow tools such as WebPack or Gulp, you could package your code like so:

The first file in the package says:


``` js
function myCode() {
```

The package would be followed by all your own code.

The final file in the package would be:
``` js
}

X.runInCaptivateWindow(myCode.toString());
```

Now you can use Animate and CpMate as a way to include your code and other Javascript libaries into Captivate. When you want to update your code in Captivate, just republish the Adobe Animate fileand update it in Captivate. Your code will be packaged within the Captivate Project and can be shared with any other Captivate developer (so long as they have the latest version of CpExtra installed)
