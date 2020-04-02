# Captivate Config
## Required Configurations
### CpExtra
The only **required** configuration of Captivate is that CpExtra is installed and working. To learn how to do that see the CpExtra help.

### Turn on UseWidget7
This requires editing the AdobeCaptivate.ini file in your program files. If this edit is not made, you may be unable to interact with the Animate OAM in Captivate. Therefore, features such as sliders will fail to work.
1. Close Adobe Captivate.
1. Go to your Captivate install folder. On windows that will likely be: C:\Program Files\Adobe\Adobe Captivate \<VERSION\> x64
2. Duplicate the **AdobeCaptivate.ini** file and rename it **AdobeCaptivate_backup.ini**
::: tip
If something goes wrong with this process you can always restore the old version of the AdobeCaptivate.ini file by deleting it and renaming this AdobeCaptivate_backup.ini back to AdobeCaptivate.ini
:::
3. Paste a copy of the AdobeCaptiate.ini file on your desktop and use a basic text editing program (such as Notepad on Windows) to open it.
4. Find the line that says...
```
UseWidget7 = 0
```
...and change it to...
```
UseWidget7 = 1
```
5. Save and close the file.
6. Move the AdobeCaptivate.ini on your desktop back into the Adobe Captivate install folder

::: warning
You will have to redo this every time you install a new version of Captivate, or Captivate updates itself to a new minor version.
:::

## Recommended Configurations
### Place an instance of the Animation OAM on the first slide of the project and set it to display for rest of project
We are here assuming that all your animations are included in the same Adobe Animate file (thanks to X.preferences.linkNameToLibrarySymbol).
The advantage of doing this means that all the Animation's OAM's required script and animation files are loaded at the start of the lesson and are **never unloaded**.
Without taking this step if you had the following setup:

- Slide 5: Animation #1
- Slide 6: No animation
- Slide 7: Animation #2
 
 Then after watching Animation #1 on slide 5 and progressing to slide 6, all the script and graphic files the animation uses are unloaded. When you move into slide 7, the browser will need to load them all over again before the animation can play.
 To avoid this do the following.

1. Import the published Adobe Animate OAM on to the first visible slide of your Captivate project. Or drag the OAM out of the Captivate Library if its already there.
2. Scale the Web Object down so it is very small and place it in the bottom-right of the stage, so that just one or two pixels of it are showing.
3. Go to the Timing panel and set the Web Object to: Display for rest of project.

![Display For Rest Of Project option inside of Captivate](./img/cp-config_display-for-project.png)

### Configure xprefEnsureCpMateLoad
Besides loading in required files, each Web Object needs some time to run it initialization code before playing an animation. Unfortunately, there is no way to speed this up. However, there is a way to make Captivate pause playback until the animation is ready.
This is done using CpExtra's xprefEnsureCpMateLoad preference variable.
1. In Captivate go to Project > Variables
2. Create a new variable called xprefEnsureCpMateLoad
3. This is the important part. **assign xprefEnsureCpMateLoad an @syntax query which will match the name of all Web Objects loading CpMate animations.** 

To do this, you will need to work out a naming convention for all your animations. An example is showin in the screenshot of an Adobe Animate project's library below:

![Screenshot of Adobe Animate library with multiple animations, all of whose linkage name starts with 'section'](./img/cp-config_naming-convention.png)

In the above example all the animations have a common naming convention. They all start with: 'section\_'. When displaying these animations in Captivate, we will be naming the Web Objects: section\_1, section\_1\_1, section\_1\_2 and so on. If we clue CpExtra into this naming convention it will be able to detect when a Web Object with an animation is appearing on screen. It will then pause the Captivate project until it can be sure the animation is ready.
In this case, assigning the following value to xprefEnsureCpMateLoad will allow CpExtra to find all the Animation Web Objects:

![Assigning section\_@ to xprefEnsureCpMateLoad](./img/cp-config_pref-variable-value.png)

The '@' in 'section\_@' is a wildcard which indicates any value could be placed there and the convention would still be met.
Let's suppose you had Web Objects in your movie named the following:

- section\_1
- section\_2
- 3\_section

The first two would match and get the special xprefEnsureCpMateLoad treatment. The third one does not match and would be treated as a regular Web Object.

::: tip
While we use the section\_@ convention as an example here, this is by no means the only right one. You could try anim\_@ or slide\_@ or something else which fits with the way you build courses.
:::

