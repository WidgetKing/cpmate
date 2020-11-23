// Directory
exports.devDirectory = "components/scripts/js/dev";
exports.devOutputDirectory = "builds/development";
exports.productionOutputDirectory = "builds/production";
exports.effectsDirectory = "components/scripts/xml";

// File Names
exports.compiledCpMateName = "Infosemantics_CpMate.js";

// File Paths
exports.devEntryPoint = exports.devDirectory + "/entrypoint.js";

// Globs
exports.allCpMateModules = exports.devDirectory + "/**/*.js";
exports.orderedCpMateModules = [
    exports.devEntryPoint,
    exports.allCpMateModules
];
exports.allEffects = exports.effectsDirectory + "/*.xml"
exports.allInDevelopment = exports.devOutputDirectory + "/*.*";
