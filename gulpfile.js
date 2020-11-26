const { parallel, watch, series } = require("gulp"),
  compile = require("./workflow/compile"),
  version = require("./workflow/version"),
  updateTests = require("./workflow/update-tests"),
  karma = require("./workflow/karma"),
  server = require("./workflow/server"),
  sources = require("./workflow/sources");

/////////////////////////
//// Compile
/////////////////////////
function compileJSModulesAndStoreInDevBuilds(done) {
  compile.globIntoFile(
    sources.orderedCpMateModules,
    sources.compiledCpMateName,
    sources.devOutputDirectory,
    done
  );
}

function copyEffects(done) {
  compile.copy(sources.allEffects, sources.devOutputDirectory, done);
}

function copyDevToProduction(done) {
  compile.copy(
    sources.allInDevelopment,
    sources.productionOutputDirectory,
    done
  );
}

/////////////////////////
//// Update tests
/////////////////////////
function updateCpMateTests(done) {
  updateTests.updateGlob(
    sources.testsCpMateGlob,
    sources.devOutputCompiledCpMate,
    done
  );
}

/////////////////////////
//// Tasks
/////////////////////////
exports.compileJSOutput = series(
  version.incrementBuildNumber,
  compileJSModulesAndStoreInDevBuilds
);

exports.compileForProduction = series(
  exports.compileJSOutput,
  copyEffects,
  copyDevToProduction
);

exports.runUnitTests = karma.run(__dirname, true);
exports.runUnitTestsContinually = karma.run(__dirname);

exports.piMode = done => {
  server.start(done);
  watch(sources.allCpMateModules, exports.compileJSOutput);
  watch(sources.devOutputCompiledCpMate, updateCpMateTests);

  // If we can't get reload to work from workflow/update-tests.js
  watch(sources.captivateTestsDirectory).on("change", server.reload);
};

exports.default = parallel(exports.runUnitTestsContinually, exports.piMode);

