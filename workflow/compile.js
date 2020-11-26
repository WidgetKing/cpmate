const gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    version = require("./version"),
    gconcat = require("gulp-concat");

exports.globIntoFile = (glob, fileName, destination, done) => {
    return gulp
        .src(glob)
        .pipe(gconcat(fileName))
        .pipe(version.replaceBuildPlaceholder())
        .pipe(version.replaceVersionPlaceholder())
        .pipe(uglify())
        .pipe(gulp.dest(destination))
        .on("end", done);
};

exports.copy = (file, destination, done) => {
    return gulp
        .src(file)
        .pipe(gulp.dest(destination))
        .on("end", done);
};
