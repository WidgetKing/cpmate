# Purpose
So what's the big idea? What does a project running CpMate look like?
CpMate's development was inspired by what the developers consider Captivate's 'Golden Era'. This was back in the Flash SWF days where you could build rich animations inside of Adobe Flash and then easily import them into Captivate. This symbiotic relationship between Captivate and Flash allowed eLearning developers to build a rich variety in courses. If you couldn't build it in Captiate, no problem! Build it in Flash and import it.
Complex concepts process maps could be explained with simple animations.
Customer and staff communications could be illustrated with character animations.
The brave even built interactive learning games.

And then Steve Jobs released the iPad and the whole industry took one giant leap backwards. (To all the Flash Player haters reading this now, [I'd like to redirect you here](../../flash-haters))
Yes, with no support for Flash Player on Apple's latest IT thing, Adobe Flash was so ashamed it moved overseas and changed its name to Adobe Animate and took up a quiet life of exporting image sequences and beekeeping.
But times are different now! Yes, it took a good decade, but Adobe Animate's HTML5 export is quite reliable and look! Over the horizon comes CpMate! Riding a stallion and donning a wide-brimmed acubra hat. Huzzah! The sheriff is back in town.

## Here's how it works
Once CpExtra and CpMate are installed (see the following pages for how to do that) your workflow will be the following:

1. Build an animation inside of Adobe Animate
::: tip
We HIGHLY recommend you look into X.preferences.linkNameToLibrarySymbol
This feature allows you to use one animate document to hold multiple animations.
:::
2. Go to File > Publish Settings...
3. Check the OAM package export

![Adobe Animate OAM publish settings](./img/purpose_publish-oam.png)

4. Publish the Adobe Animate project.
5. Inside your Captivate project, go to Media > HTML5 Animation

![Importing a HTML5 Animation into Captivate](./img/purpose_captivate-import.png)

6. This will bring up a file browser where you'll navigate to (you guessed it) the .oam file you exported from captivate

::: tip Vocabulary Alert!
In this help site we will need to take about this file a lot. We will refer to it as the **Animate OAM**.
:::

7. Place this animation where you desire it to appear on the Captivate stage.
8. If you are using Captivate Timeline Syncing features, at this point you would start adding effects to the Web Object to signal to CpMate when you want different sections of the animation to start playing ([This page explains these features](../../features/captivate-timeline-sync))
9. Preview or publish your Captivate project.

::: danger
The Animate OAM is essentially a webpage. So Captivate is going to be displaying a webpage in a webpage. Don't fret, this is a common technique in web development. However, web browsers are particularly observant of this practice. They monitor the communication between the parent web page and the child web page to make sure nothing unusual is happening. Generally speaking, as long as you're watching the Captivate project from a web server or local host server everything will be fine.

You can easily test from a local host server by choosing the correct Captivate preview option.

**In a normal project** you could choose:
- Preview > HTML5 in Browser

**In a responsive project** you could choose:
- Preview > Live Preview on Devices
- Preview > Project
- Preview > Next # Slides
:::

10. Everything going well you should see the Animate OAM's animation playing back inside Captivate. If not, check out our extensive [troubleshooting](../../troubleshooting/about) section to track down your issue.

## What can be built with this?
While we expect the majority of people to use CpMate to build animations which sync to the course's voice-over, it is also possible to build interactions.

Those familiar with Infosemantics's Slide Component widget will be happy to know that CpMate includes support for sliders.

## What's next?
Next we need to discuss the required software you'll need to make CpMate work for you as well as how to configure Adobe Animate and Adobe Captivate to work smoothly with CpMate.
