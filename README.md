# CpMate

This is a project that aids communication between Adobe Animate CC HTML5 export and Adobe Captivate with CpExtra. It allows you to do such things as control the animation's timing from within Adobe Captivate.

## Gulp Tasks

### Default
- Runs unit tests when test or dev file updates.
- Compiles dev build when dev file updates.
- Updates Captivate export tests.

### gulp piMode
- Same as default, but doesn't run unit tests.

Unit tests run in Karma, which can't run on a pi because I haven't worked out how to use headless chrome yet.

### gulp runUnitTestsContinually
- Kicks off the karma server and re-runs tests whenever the tests or dev files update.

### gulp runUnitTests
- Runs Karma unit tests once.

### gulp compileForProduction
- Creates production ready versions of dev files.

Which at the time of writing is no different to regular development files.

### gulp compileJSOutput
- Takes dev js files, consolodates them into a single file, saves file to the development builds folder.
