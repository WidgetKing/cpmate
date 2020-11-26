const rootDirectory = require("./sources").captivateTestsDirectory,
  { src } = require("gulp"),
  { callWithCooldown } = require("./utils"),
  connect = require("gulp-connect");

exports.start = done => {
  connect.server(
    {
      root: rootDirectory,
      livereload: true,
      port: 7070
    },
    function() {
      this.server.on("close", done);
    }
  );
};

exports.reload = callWithCooldown(filepath => {
	
  console.log("RELOADING TEST SERVER");
  src(filepath, { read: false }).pipe(connect.reload());

});
