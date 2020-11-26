// Directory
const workingJavascriptDirectory = "components/scripts/js";
exports.devDirectory = workingJavascriptDirectory + "/dev";
exports.unitTestsDirectory = workingJavascriptDirectory + "/tests";
exports.devOutputDirectory = "builds/development";
exports.productionOutputDirectory = "builds/production";
exports.effectsDirectory = "components/scripts/xml";
exports.captivateTestsDirectory = "tests/output";

// File Names
exports.compiledCpMateName = "Infosemantics_CpMate.js";

// File Paths
exports.devEntryPoint = exports.devDirectory + "/entrypoint.js";
exports.devOutputCompiledCpMate = exports.devOutputDirectory + "/" + exports.compiledCpMateName;

// Globs
exports.allCpMateModules = exports.devDirectory + "/**/*.js";
exports.orderedCpMateModules = [
    exports.devEntryPoint,
    exports.allCpMateModules
];

exports.allUnitTests = exports.unitTestsDirectory + "/**/*.js";

exports.allEffects = exports.effectsDirectory + "/*.xml"
exports.allInDevelopment = exports.devOutputDirectory + "/*.*";

exports.testsCpMateGlob = exports.captivateTestsDirectory + "/**/Infosemantics_CpMate.js";
