# X.runInCaptivateWindow()
Are you a Javascript developer? Are you looking for an easy way to run your Javascript code in Captivate and update it easily?

Is X.runInCaptivateWindow() is the function for you.

Convert any code that you have to a string and then pass it into X.runInCaptivateWindow. CpMate will then pass it up to the Captivate window to be executed there.

``` js
X.runInCaptivateWindow("alert('Captivate code here!')");
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/0xnez4HEDP0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Preventing Code Running Twice
Imagine slides 1 and 2 of your Captivate project display the same Adobe Animate OAM with the following code:

``` js
var code = "alert('Hello World')";
X.runInCaptivateWindow(code);
```

What happens when you get to slide 1? An alert box appears saying: "Hello World"

What happens when you get to slide 2? The alert box will appear again. However, imagine that instead of triggering an alert box with runInCaptivateWindow() you were loading a whole Javascript library. You certainly would not want this to be executed on every slide that contains the Animate OAM. Fortunately, **the second parameter** of runInCaptivateWindow() allows you to give your code an id. Code associated with one id can only be run once.


``` js
var code = "alert('Hello World')";
var id = "greeting";
X.runInCaptivateWindow(code, id);
```

With this change, when you go to the first slide the "Hello World" alert box appears. A note is also taken of the "greeting" id.

On the second slide, the Animate OAM will *try* to run the "Hello World" alert box code again. However, Captivate will see the "greeting" id again and prevent the code running, assuming correctly that this is duplicate code.

## Workflow
If you are handy with javascript workflow tools such as WebPack or Gulp, you could package your code like so:

The first file in the package says:


``` js
function myCode() {
```

The package would be followed by all your own code.

The final file in the package would be:
``` js
}

X.runInCaptivateWindow(myCode.toString(), "myId");
```

Now you can use Animate and CpMate as a way to include your code and other Javascript libaries into Captivate. 

# Updating
When you make an update to your code, just republish the Adobe Animate file and update it in Captivate. Your code will be packaged within the Captivate Project and can be shared with any other Captivate developer (so long as they have the latest version of CpExtra installed)
