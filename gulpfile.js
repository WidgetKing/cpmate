/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 10:08 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Variables
    ///////////////////////////////////////////////////////////////////////

    var gulp = require("gulp"),
        gutil = require("gulp-util"),
        gconcat = require("gulp-concat"),
        greplace = require("gulp-replace"),
        grename = require("gulp-rename"),
        gconnect = require("gulp-connect"),
        gglob = require("glob"),
        uglify = require("gulp-uglify"),
        gjsoneditor = require("gulp-json-editor"),


        jsonPackage = require("./package.json"),

        path = require("path"),
        karma = require("karma"),
        karmaParseConfig = require("karma/lib/config").parseConfig,
        karmaConfig = "karma.conf.js";

    var compiledFileName = "Infosemantics_CpMate.js",
        compiledFileLocation = "builds/development",
        jsSources = [
            "components/scripts/js/dev/entrypoint.js",
            "components/scripts/js/dev/**/"
        ];

    var buildNumber = jsonPackage.build,
        versionNumber = jsonPackage.version;




    //////////////////////////////////////
    ///////// TASKS
    //////////////////////////////////////

    function iterateBuildNumber () {

        buildNumber += 1;

        gulp.src("./package.json")
            .pipe(gjsoneditor({
                "build":buildNumber
            }))
            .pipe(gulp.dest("./"));

        return buildNumber;

    }

    function concatFiles(glob,fileName,destination) {

        return gulp.src(glob)
            .pipe(gconcat(fileName))
            .pipe(greplace("$$VERSION_NUMBER$$",jsonPackage.version))
            .pipe(greplace("$$BUILD_NUMBER$$",buildNumber))
            //.pipe(uglify())
            .pipe(gulp.dest(destination));
    }






    gulp.task("iterateBuildNumber", function () {
        gutil.log("Build Number: " + iterateBuildNumber());

    });

    gulp.task("compilejs", function () {

        return concatFiles(jsSources,
        compiledFileName, compiledFileLocation)

    });


    ///////////////////////////////////////////////////////////////////////
    /////////////// WATCHES
    ///////////////////////////////////////////////////////////////////////

    gulp.task("watch", function () {
        return gulp.watch(["components/scripts/js/**/*.js"],
        ["iterateBuildNumber", "updateTests-CpMate"])
    });


    ///////////////////////////////////////////////////////////////////////
    /////////////// UPDATE TESTS
    ///////////////////////////////////////////////////////////////////////

    function updateOnGlob(glob, devFile) {

        function getDirectoryPath(path) {
            var lastSlash = path.lastIndexOf("\/");
            return path.substring(0,lastSlash);
        }

        function getFileName(path) {
            var lastSlash = path.lastIndexOf("\/");
            var lastDot = path.lastIndexOf(".");
            return path.substring(lastSlash + 1, lastDot);
        }

        var stream,
            filePath,
            directoryPath,
            fileName;

        // Get list of files matching glob
        gglob(glob, {}, function (er, files) {

            // Loop through file list
            for (var i = 0; i < files.length; i += 1) {

                filePath = files[i];
                fileName = getFileName(filePath);
                directoryPath = getDirectoryPath(filePath);

                // DEBUGGING: Trace list of files
                gutil.log(directoryPath);

                // Rename the javascript file to either the widget or the headless name
                stream = gulp.src(devFile).pipe(grename({
                        basename: fileName
                    }))
                    // Save the new version over the currently located CpExtra instance
                    .pipe(gulp.dest(directoryPath))
                    .pipe(gconnect.reload());

            }

        });

        return stream;
    }

    gulp.task("updateTests-CpMate", ["compilejs"], function () {

        return updateOnGlob("tests/output/**/@(Infosemantics_CpMate.js)", compiledFileLocation + "/" + compiledFileName);

    });

    gulp.task("updateTests-CpExtra", function () {
       return updateOnGlob("tests/output/**/@(captivate_extra.js|Infosemantics_CpExtra.js)","components/scripts/libs/Infosemantics_CpExtra.js");
    });
    ///////////////////////////////////////////////////////////////////////
    /////////////// SERVER
    ///////////////////////////////////////////////////////////////////////

    gulp.task("connect", function () {
        return gconnect.server({
            root: "tests/output",
            livereload: true,
            port: "7070"
        });
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// KARMA
    ///////////////////////////////////////////////////////////////////////
    function runKarma(configFilePath, options, cb) {
        configFilePath = path.resolve(configFilePath);

        var log = gutil.log,
            colours = gutil.colors,
            config = karmaParseConfig(configFilePath, {}),
            server;

        Object.keys(options).forEach(function (key) {
            config[key] = options[key];
        });

        server = new karma.Server(config, function(exitCode) {
            log("Karma has exited with " + colours.red(exitCode));
            cb();
            process.exit(exitCode);
        });
        server.start();
    }

    gulp.task("test", function(cb) {
        runKarma(karmaConfig, {
            autoWatch: false,
            singleRun: true
        }, cb);
    });


    gulp.task("test-dev", function(cb) {
        runKarma(karmaConfig, {
            autoWatch: true,
            singleRun: false
        }, cb);
    });
    ///////////////////////////////////////////////////////////////////////
    /////////////// DEFAULT
    ///////////////////////////////////////////////////////////////////////
    gulp.task("default", ["updateTests-CpMate", "connect", "watch", "test-dev"]);

}());
