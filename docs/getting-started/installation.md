# Installation
Once you have bought CpMate you can install it in two steps.

### Step #1
Place the *Infosemantics_CpMate.js* file in a directory where you'll know you won't move or delete it.
::: tip
Say you had two developers working on one course. Both will be editing and publishing the Adobe Animate file. 
You will need to have the *Infosemantics_CpMate.js* file *installed in the same folder on both machines*.
Therefore, we highly recommend creating a folder at the top of one of your drives (ideally the C Drive) and storing CpMate there.
Something like: C:\_PROJECTS\_RESOURCES\Infosemantics_CpMate.js?

### Step #2
Open up your Adobe Animate project.
Go to the Actions Panel.
Continue writing instructions.

### Step #3 (recommended)
While not essential to installation, we highly recommend you **do the following otherwise mouse interaction with the Adobe Animate OAM will not work**
1. Close Adobe Captivate.
1. Go to your Captivate install folder. On windows that will likely be: C:\Program Files\Adobe\Adobe Captivate <VERSION> x64
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

