# Captivate Interaction
CpMate allows you to communicate between Captivate and Adobe Animate. Animate can set off Captivate actions. Captivate can change the appearance of content inside Animate.

Much of this is thanks to the fact that if you have CpMate, you must also have CpExtra. This means as long as you can access Captivate variables from Adobe Animate, you can use CpExtra's command variables to trigger a lot of different actions.

Much of this requires a basic understanding of Javascript. Teaching that is outside the scope of this help site. In this page we will assume you know about objects, strings, numbers, booleans as well as accurate Javascript syntax.

## Reading Captivate Variables
When the Animate OAM is loaded as a Web Object in Captivate, the Captivate Variables can be accessed within Adobe Animate with the following code:

``` js
X.captivate.variables
```

This object contains all the Captivate variables. 

Let's say you have a Captivate variable named **MyVar**. To save that variable's value into a variable you'd write the following:

``` js
var myVar = X.captivate.variables.MyVar;

// Display the value in an alert box, just to prove this works.
alert(myVar);
```

## Writing to Captivate Variables
To assign **MyVar** the value of **MyValue** write the following:

``` js
X.captivate.variables.MyVar = "MyValue";
```

## Triggering Captivate Actions
CpExtra's [**xcmndCallActionOn**](https://widgetking.github.io/cpextra/features/event-listeners.html#triggering-one-action-from-another) command variable allows you to trigger an action attached to any interactive object (such as a button, button shape, click box, text entry box, so on).

If in Captivate you had a button named **Button_1** and you wanted to trigger its success action, you could do that like so:

``` js
X.captivate.variables.xcmndCallActionOn = "Button_1, success";
```

## Sending a Score to Captivate
The Web Object can't report a score directly, but you could set up a button that reports to the quiz and use it as a proxy. Then CpExtra's [**xcmndScore**](https://widgetking.github.io/cpextra/variables/command.html#xcmndscore) command variable allows you to change that button's score accordingly.

Let's say you had set up a button to report to the quiz, that button as a name of **ProxyButton**. To change that button's score to 0, you'd write:

``` js
X.captivate.variables.xcmndScore = "ProxyButton, 0";
```

To change it's score to 10 you'd write: 

``` js
X.captivate.variables.xcmndScore = "ProxyButton, 10";
```

To change it's score to it's maximum possible score, you'd write:

``` js
X.captivate.variables.xcmndScore = "ProxyButton, max";
```

## Captivate Influencing Animate
CpMate's **Smart Instance Names** allow Captivate to change what frame a MovieClip displays or display a Captivate Variable in a text field.

We will discuss these features in the following pages.
