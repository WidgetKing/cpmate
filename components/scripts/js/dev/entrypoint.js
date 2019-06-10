/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/25/18
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    if (window.unitTests) {
        return;
    }

    window.X = {
        "version":"$$VERSION_NUMBER$$",
        "build":"$$BUILD_NUMBER$$"
    };

    var moduleRegistry = {},
    // This is only used in headless export where we might need to wait before initializing certain modules
    // because Captivate is still in the process of setting up.
        moduleInitializationQueue = [];

    X.registerModule = function (moduleName, moduleDependencies, moduleConstructor) {

		// if (moduleRegistry.hasOwnProperty(moduleName)) {

		// 	console.log("Conflict in module name: " + moduleName);
		// 	// We will abort this, preventing duplication of module calls
		// }

        var registry,
            dependency,
            dependencyRegistry,
            areDependenciesSetUp = true;

        function createRegistry(name) {
            moduleRegistry[name] = {
                "subordinates":{},
                "instantiated": false
            };
            return moduleRegistry[name];
        }

        function registerSubordinate(moduleName,subordinateName) {
            moduleRegistry[moduleName].subordinates[subordinateName] = moduleRegistry[subordinateName];
            areDependenciesSetUp = false;
        }

        // If the short hand has been used which passes in a module with no dependencies,
        // account for that case.
        if (typeof moduleDependencies === "function") {
            moduleConstructor = moduleDependencies;
            moduleDependencies = [];

            // If a single dependency has been passed in as a string rather than an array.
        } else if (typeof moduleDependencies === "string") {
            moduleDependencies = [moduleDependencies];
        }

        // If an object for this module has not been created, create that module.
        if (!moduleRegistry[moduleName]) {
            createRegistry(moduleName);
            // If a module of this name has already been created, it may have been to record its subordinates
            // On the other hand, if a contructor or dependencies parameter has been defined, another module
            // has already reserved this module name. This can be caused if some storyline code gets included with
            // the captivate export. Or visa versa
        } else if (moduleRegistry[moduleName].dependencies !== undefined) {
            throw Error("Tried to register two modules under the name: " + moduleName);
        }

        registry = moduleRegistry[moduleName];
        registry.dependencies = moduleDependencies;
        registry.moduleConstructor = moduleConstructor;

        // Loop through the dependencies to see if they have already been called.
        for (var i = 0; i < registry.dependencies.length; i += 1) {


            dependency = registry.dependencies[i];
            dependencyRegistry = moduleRegistry[dependency];

            // Make sure we're not making this module depend on itself
            if (dependency === moduleName) {
                throw new Error("Can't set up a module as a dependency of itself");
            }

            // The dependency module has already registered
            if (dependencyRegistry) {

                // But the dependency module hasn't been called yet.
                if (!dependencyRegistry.instantiated) {
                    // Leave a note with the dependency module to try and call us once he's done.
                    registerSubordinate(dependency,moduleName);
                }

            } else {

                dependencyRegistry = createRegistry(dependency);
                registerSubordinate(dependency,moduleName);

            }
        }

        if (areDependenciesSetUp) {

            initializeModuleIfReady(moduleName);
        }

    };

    function initializeModuleIfReady(moduleName) {
        if (isReadyToInitializeModules()) {
            initializeModule(moduleName);
        } else {
            moduleInitializationQueue.push(moduleName);
        }
    }

    function initializeModulesInQueue() {
        for (var i = 0; i < moduleInitializationQueue.length; i += 1) {
            initializeModule(moduleInitializationQueue[i]);
        }

        // Clear queue.
        moduleInitializationQueue = [];
    }

    function isReadyToInitializeModules() {
        return true;
        //return !isHeadless || _extra.w.cp.movie;
    }

    function initializeModule(moduleName) {
        var registry = moduleRegistry[moduleName],
            subDep,
            areAllDependenciesInitialized;


        // --------------- HERE IS THE TEST!
        registry.onLoadCallback = registry.moduleConstructor();
        /// The working code
        //registry.onLoadCallback = registry.moduleConstructor();
        registry.instantiated = true;

        // Loop through all the modules that have dependencies on this one
        for (var subordinateName in registry.subordinates) {
            if (registry.subordinates.hasOwnProperty(subordinateName)) {


                subDep = moduleRegistry[subordinateName];

                // If through another tree we've already initialized this module, then don't do it again.
                if (subDep.instantiated) {
                    continue;
                }

                // If this gets set to false, then we won't initialize this model.
                areAllDependenciesInitialized = true;


                for (var i = 0; i < subDep.dependencies.length; i += 1) {

                    if (!moduleRegistry[subDep.dependencies[i]].instantiated) {
                        areAllDependenciesInitialized = false;
                        break;
                    }

                }


                if (areAllDependenciesInitialized) {
                    initializeModule(subordinateName);
                }

            }
        }
    }

    function callOnLoadCallbacks() {

        var m;
        for (var moduleName in moduleRegistry) {
            if (moduleRegistry.hasOwnProperty(moduleName)) {
                m = moduleRegistry[moduleName];
                if (m.onLoadCallback) {

                    try {
                        // --------------- HERE IS THE TEST!
                        m.onLoadCallback();
                    } catch (e) {
                        console.error("Encountered error at module: " + moduleName + "<br/>Details: <br/>" + e);
                    }

                }
            }
        }
    }

    window.addEventListener("load", function () {
        initializeModulesInQueue();
        callOnLoadCallbacks();
    });

}());
