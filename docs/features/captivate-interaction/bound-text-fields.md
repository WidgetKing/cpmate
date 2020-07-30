# Bound Text Fields
Sometimes you want a text field in Animate to display text that comes from Captivate. By naming text field in a certain way, CpMate will collect the desired text from Captivate and display that text inside the desired text field.

To give a text field an instance name, you'll need to make it a Dynamic Text Field.

IMAGE HERE

You can bind a text field in several ways.

## xTextFromVariable
To link a dynamic text field's text with the value of a Captivate variable, you'll name it: **xTextFromVariable\_\<INSERT VARIABLE NAME HERE\>**

### Example
Let's say you wanted a text field to display the learner's current quiz score. That is held in the Captivate System Variable: **cpQuizInfoPointsscored** (not a typo)

To show that score, name a dynamic text field: **xTextFromVariable_cpQuizInfoPointsscored**

## xTextFromCaption

::: warning Only Available In Responsive Captivate Projects
CpMate can't read a Caption's text inside of non-responsive projects. In those circumstances, try using **xTextFromAccessibilityText** instead.
:::

To link a dynamic text field's text with the text in a Captivate Caption, you'll name it: **xTextFromCaption\_\<INSERT VARIABLE NAME HERE\>**

This prefix can also be used to read text from inside a Smart Shape.

### Example
Let's say you had a multi-lingual course. You want to provide the translator with the Captivate project only. You don't want them to need to open up Adobe Animate and play around with your animation while looking for that text field you told them about. In that case you can point all the Animate text fields to pull their values from Captivate captions (which will be hidden in the export).

So if you had a caption called: **TextForAnimate**

You'd give the corresponsing Animate text field the name: **xTextFromCaption_TextForAnimate**

## xTextFromAccessibilityText
Most Captivate objects allow you to input accessibility text, which can be read by a screen reader. You can insert that text like so:

1. ???
2. ???

IMAGE HERE AND UPDATE THE INSTRUCTIONS

To link a dynamic text field's text with a Captivate object's accessiblity text, you'll name it: **xTextFromAccessibilityText\_\<INSERT VARIABLE NAME HERE\>**

Usually you'd only use this when you're in a non-responsive Captivate project and can't use xTextFromCaption.
