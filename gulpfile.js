const { watch, series } = require("gulp"),
    compile = require("./workflow/compile"),
    version = require("./workflow/version"),
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
//// Tasks
/////////////////////////
exports.compileJSOutput = series(
    version.incrementBuildNumber,
    compileJSModulesAndStoreInDevBuilds
);

exports.compileForProduction = series(exports.compileJSOutput, copyEffects, copyDevToProduction);
