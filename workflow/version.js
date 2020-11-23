const gulp = require("gulp"),
    gjsoneditor = require("gulp-json-editor"),
    greplace = require("gulp-replace"),
    packageJSON = require("../package.json"),
    versionNumber = packageJSON.version;

var buildNumber = packageJSON.build;

///////// Utils for other modules
exports.getCurrentVersion = () => versionNumber;
exports.getCurrentBuild = () => buildNumber;

exports.replaceBuildPlaceholder = () => {
    return greplace("$$BUILD_NUMBER$$", buildNumber);
};

exports.replaceVersionPlaceholder = () => {
    return greplace("$$VERSION_NUMBER$$", versionNumber);
};

///////// Main Task
exports.incrementBuildNumber = done => {
    buildNumber += 1;

    gulp.src("./package.json")
        .pipe(
            gjsoneditor({
                build: buildNumber
            })
        )
        .pipe(gulp.dest("./"))
        .on("end", done);

    console.log(`New Build: ${buildNumber}`);

    return buildNumber;
};
