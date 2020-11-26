const gglob = require("glob"),
  // server = require("./server"),
  gulp = require("gulp"),
  {
    pipe,
    take,
    forEach,
    complement,
    dropLast,
    takeLastWhile,
    length,
    inc,
    equals
  } = require("ramda");

// Pass a file path, return the file name.
const getFileName = takeLastWhile(complement(equals("/")));
const getNameLength = pipe(getFileName, length, inc);
const getDirectory = path => {
  const nameLength = getNameLength(path);
  return dropLast(nameLength, path);
};

exports.updateGlob = function(glob, file, done) {
  // Convert glob to an array of file paths
  gglob(glob, {}, (er, files) => {
    // Will save the last stream so we can listen for its completion
    var stream;

    forEach(filePath => {
      const fileDirectory = getDirectory(filePath);

      console.log("Updated: " + fileDirectory);

      stream = gulp.src(file).pipe(gulp.dest(fileDirectory));
    }, files);

    // this is the last stream. When it has been completed
    // we will signal the action as complete
    // if (stream) stream.pipe(server.reload).on("end", done);
    if (stream) stream.on("end", done);
    else done();
  });
};
