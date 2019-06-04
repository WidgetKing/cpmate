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
        "version":"0.0.2",
        "build":"2185"
    };

    var moduleRegistry = {},
    // This is only used in headless export where we might need to wait before initializing certain modules
    // because Captivate is still in the process of setting up.
        moduleInitializationQueue = [];

    X.registerModule = function (moduleName, moduleDependencies, moduleConstructor) {


		if (moduleName === "elements/animate") {
			// throw new Error("What is the source?");
			console.log("Registering");
		}

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

/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("classes/Callback", ["managers/classes"], function () {

    "use strict";

    X.classes.register("Callback", function () {

        this.data = {};
        var that = this;

        function validateDataIndex (index) {

            if (!that.data[index]) {

                that.data[index] = {
                    "overwritable": null,
                    "regular": []
                };

            }

        }

        this.addCallback = function (index, callback, overwritable) {

            // If this is the first callback we're adding.
            validateDataIndex(index);

            if (overwritable) {
                that.data[index].overwritable = callback;
            } else {
                that.data[index].regular.push(callback);
            }
        };

        that.addCallbackToFront = function (index, callback) {
            // If this is the first callback we're adding.
            validateDataIndex(index);

            that.data[index].regular.unshift(callback);
        };

        this.hasCallbackFor = function (index) {
            return that.data[index] !== undefined;
        };

        this.sendToCallback = function (index,parameter) {
            var returnValue,
                tempReturnValue,
                data = that.data[index];

            if (data) {

                // Trigger overwritable callback
                if (data.overwritable) {
                    data.overwritable(parameter);
                }

                // Trigger regular callbacks
                var a = data.regular;

                for (var i = 0; i < a.length; i += 1) {

                    // If the callback returns a value, then we'll return it at the end (assuming noting overrides it before then)
                    tempReturnValue = a[i](parameter);

                    if (tempReturnValue !== undefined) {
                        returnValue = tempReturnValue;
                    }

                }
            }

            return returnValue;
        };

        this.forEach = function (method) {

            var a;

            for (var index in that.data) {
                if (that.data.hasOwnProperty(index)) {

                    if (that.data[index].overwritable) {
                        method(index, that.data[index].overwritable);
                    }

                    a = that.data[index].regular;
                    for (var i = 0; i < a.length; i += 1) {
                        method(index,a[i]);
                    }

                }
            }
        };

        this.removeCallback = function (index, callbackToRemove) {

            var data = that.data[index];

            if (data) {

                // Check overwrite first
                if (data.overwritable && data.overwritable === callbackToRemove) {
                    delete data.overwritable;
                    return;
                }

                var a = data.regular,
                    registeredCallback;


                for (var i = 0; i < a.length; i += 1) {

                    registeredCallback = a[i];

                    if (callbackToRemove === registeredCallback) {
                        a.splice(i,1);

                        // If we have just deleted the last callback for this index, then we'll delete the array so that
                        // hasCallbackFor() will be able to respond accurately.
                        if (a.length <= 0) {
                            delete that.data[index];
                        }
                        break;
                    }

                }
            }
        };

        this.removeIndex = function(index) {
            delete that.data[index];
        };

        this.clear = function () {
            that.data = {};
        };

    });
}, "class");

/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("classes/CallbackObject", ["managers/classes"], function () {

    "use strict";

    X.classes.register("CallbackObject", function () {

		var CallbackClass;

		// Yes, it's not good that we're making a reference to the unit tests
		// in the main code but... does this save a lot of time in bug hunting
		// do I tell you.
		if (window.X) {
			CallbackClass = X.classes.Callback;
		} else {
			CallbackClass = unitTests.classes.Callback;	
		}

        var callback = new CallbackClass();
        var obj = {};

        this.callback = callback.addCallback;

        /**
         * When a property is changed it will send a message to any
         * callbacks associated with that property.
         *
         * @param  {string} key the property to be changed
         * @param  {*} value the value for the property to be changed to
         */
        this.setProp = function (key, value) {

          obj[key] = value;

          callback.sendToCallback(key, value);
          callback.sendToCallback("*", value);

        }

        this.getProp = function (key) {
          return obj[key];
        }

        this.hasProp = function (key) {
          return obj.hasOwnProperty(key);
        }

		this.removeCallback = callback.removeCallback;

    });

}, "class");

X.registerModule("classes/DisplayObjectProxy", ["managers/classes"], function () {

	function invertProp(propName) {

		if (propName === "x") propName = "y"
		else if (propName === "y") propName = "x"
		else if (propName === "width") propName = "height"
		else if (propName === "height") propName = "width"
		return propName

	}		

	function DisplayObjectProxy(org) {
		this.original = org;
		this.bounds = org.getBounds();
		this.switchBoundsProps = org.rotation === 90 || org.rotation === -90;
	}

	DisplayObjectProxy.prototype = {
		getBoundsProp: function (propName) {

			if (this.switchBoundsProps) {

				propName = invertProp(propName);

			}

			return this.bounds[propName];
		},
		get x() {

			return this.original.x + this.getBoundsProp('x');

		},
		set x(val) {

			this.original.x = val - this.getBoundsProp('x');			
			
		},
		get y() {

			return this.original.y + this.getBoundsProp('y');			

		},
		set y(val) {

			this.original.y = val - this.getBoundsProp('y');			
			
		},
		get width() {

			return this.getBoundsProp('width');			

		},
		get height() {

			return this.getBoundsProp('height');			


		},
		get rotation() {
			return this.original.rotation;
		},

		get primary() {
			return this._pa;
		},

		set primary(val) {
			this._pa = val;

			if (val === "x") {
				this._pl = "width";		
			} else {
				this._pl = "height";		
			}

			this._sl = invertProp(this._pl);
			this._sa = invertProp(this._pa);
		},

		get primaryAxis() {
			return this[this._pa];
		},

		set primaryAxis(val) {
			this[this._pa] = val;
		},

		get primaryLength() {
			return this[this._pl];
		},

		get secondaryAxis() {
			return this[this._sa];
		},
		set secondaryAxis(val) {
			this[this._sa] = val;
		},
		get secondaryLength() {
			return this[this._sl];
		}
	}

    X.classes.register("DisplayObjectProxy", DisplayObjectProxy);

}, "class");

X.registerModule("classes/MovieClipProxy", ["managers/classes"], function () {
	
	function MovieClipProxy (base) {

		this._original = base;

	}
	

	X.classes.register("MovieClipProxy", MovieClipProxy);


	MovieClipProxy.prototype = {
		get labels() {

			return this._original.timeline._labels;

		},

		hasLabel: function (labelName) {
			return this.labels.hasOwnProperty(labelName);
		},

		getLabelFrame: function (labelName) {
			return this.labels[labelName];
		},

		gotoAndStop: function (location) {

			this._original.gotoAndStop(location);

		}
	};


}, "class");

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/animate", [], function () {

    "use strict";

    var callWhenLoadedList = [],
        waitingForAnimateLoadInterval;

    function isAnimateLoaded () {
        return window.stage;
    }

    function animateLoadIntervalHandler () {

        if (isAnimateLoaded()) {

            window.clearInterval(waitingForAnimateLoadInterval);

            for (var i = 0; i < callWhenLoadedList.length; i += 1) {

                callWhenLoadedList[i]();

            }

            waitingForAnimateLoadInterval = null;
            callWhenLoadedList = null;

        }

    }

    function setUpAnimateLoadInterval () {

        waitingForAnimateLoadInterval = window.setInterval(animateLoadIntervalHandler, 10);

    }

    X.animate = {

        "callWhenLoaded": function (method) {

            if (isAnimateLoaded()) {

                if (waitingForAnimateLoadInterval) {

                    // Oh, the interval has not discovered animate is loaded
                    // Strange as it may seem, I've actually had this happen.
                    callWhenLoadedList.push(method);
                    animateLoadIntervalHandler();

                } else {

                    method();

                }


            } else {

                callWhenLoadedList.push(method);

                if (!waitingForAnimateLoadInterval) {

                    setUpAnimateLoadInterval();

                }
            }

        }

    };

    X.animate.callWhenLoaded(function () {

        X.animate.stage = stage;

		// Now that we have access to the stage it's important we add
		// support for touch events.
		// We put this code here rather than in another file because
		// the stage takes an arbitrary amount of time to load.
		// Therefore this is the safest place to put it.
		createjs.Touch.enable(X.animate.stage, true);

        X.animate.mainTimeline = stage.children[0];

        if (window.AdobeAn) {

            X.animate.library = AdobeAn.getComposition(AdobeAn.bootcompsLoaded[0]).getLibrary();

        }

		// Now is the point where it is safe for the nimation to play
		document.dispatchEvent
    });

    /*
    var time = 0;

    var interval = window.setInterval(function () {

        if (window.stage) {

            console.log("Ready: " + time);
            console.log(stage)
            window.clearInterval(interval);

        }

        time += 10;

    }, 10);

    window.addEventListener("load", function () {
        console.log(stage);
        X.animate = {
            "mainTimeline": stage.children[0]
        }
    });
*/
});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:56 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/captivate", ["managers/debugging/logging"], function () {

    var MINIMUM_CP_EXTRA_VERSION = "1.4.2";

    X.captivate = {
        "isLoaded":function () {
            return window.parent && window.parent.hasOwnProperty("cp");
        },
        "hasCpExtra": function () {
            if (X.captivate.window) {
                return X.captivate.window.hasOwnProperty("_extra");
            }
            return false;
        },
        "window":null,
        "base": null,
        "extra": null,
        "variables": null
    };

    function getCaptivateElements () {

        if (X.captivate.isLoaded()) {

            X.captivate.window = window.parent;
            X.captivate.base   = X.captivate.window.cp;
            X.captivate.alert  = X.captivate.window.alert;
            X.captivate.variables = X.captivate.window;

            if (X.captivate.hasCpExtra()) {

                X.captivate.extra = {};
                getCpExtraElements();

            } else {
                X.error("GE001");
            }

        }
    }

    function getCpExtraElements () {

        X.captivate.extra = X.captivate.window._extra;
        X.captivate.extraPublicInterface = X.captivate.window.X;
        X.captivate.extraVersion = X.captivate.extraPublicInterface.version;
		X.captivate.extraCallActionOn = X.captivate.extraPublicInterface.callActionOn;

        if (X.captivate.extraVersion < MINIMUM_CP_EXTRA_VERSION) {
            X.error("GE002", X.captivate.extraVersion, MINIMUM_CP_EXTRA_VERSION);
        }

    }

    getCaptivateElements();

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 10:25 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("elements/slideObject", ["elements/captivate", "managers/broadcast"], function () {

    function recursiveParentSearch (tag, property, value) {

        while (tag.parentElement) {

            if (tag.getAttribute(property) === value) {
                return tag;
            } else {
                tag = tag.parentElement;
            }
        }

        return null;

    }

    if (X.captivate.isLoaded()) {

        X.slideObject = {};
        X.slideObject.iframe = window.frameElement;
        X.slideObject.div = recursiveParentSearch(X.slideObject.iframe, "class", "cp-WebObject");
        X.slideObject.name = X.slideObject.div.getAttribute("id");
        // Remove the 'c' from end of name
        // Eg. change 'Web_1c' to 'Web_1';
        X.slideObject.name = X.slideObject.name.substring(0, X.slideObject.name.length - 1);

        if (X.captivate.extra) {
            X.slideObject.proxy = X.captivate.extra.slideObjects.getSlideObjectByName(X.slideObject.name);
        }

    }

    X.broadcast.addCallback("unload", function () {
        if (X.slideObject) {
            delete X.slideObject.proxy;
        }
    });

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/broadcast", ["classes/Callback"], function () {

    "use strict";

    X.broadcast = new X.classes.Callback();

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/classes", function () {

    "use strict";

    X.classes = {

        "register": function (className, classConstructor) {

            if (X.classes.hasOwnProperty(className)) {
                console.log("Already registered a class by the name of: " + className);
                return;
            }

            X.classes[className] = classConstructor;

        }

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 2:49 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/cpExtraActions", ["elements/captivate", "elements/slideObject"], function () {

    "use strict";

    var cpExtraActions = {};

    function init () {
        createCpExtraActionsArchitecture();

        // If neither captivate or CpExtra has been loaded, then do not continue.
        if (!X.captivate || !X.captivate.extra) {

            return;

        }

        registerWithCpExtra();
    }

    function createCpExtraActionsArchitecture () {

        X.cpExtraActions = {
            "register": function (actionName, method) {

                cpExtraActions[actionName] = method;

            },
            "unload": function () {
                X.captivate.extra.cpMate.deregister(X.slideObject.name, cpExtraBroadcastReceiver);
                X.captivate.extra.cpMate.deregister("*", cpExtraBroadcastReceiver);
            }
        };

    }


    function registerWithCpExtra () {

        X.captivate.extra.cpMate.register(X.slideObject.name, cpExtraBroadcastReceiver);
        X.captivate.extra.cpMate.register("*", cpExtraBroadcastReceiver);

    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Receiver
    ///////////////////////////////////////////////////////////////////////

    function cpExtraBroadcastReceiver (data) {

        if (!data.action || !data.parameters) {
            X.error("When broadcasting an action to CpMate an action or parameter was not defined");
            return;
        }

        if (!cpExtraActions.hasOwnProperty(data.action)) {
            X.error("Tried to enact CpMate action '" + data.action + "'. However, no such action was defined in CpMate.");
            return;
        }

        cpExtraActions[data.action].apply(null, data.parameters);

    }

    init();




});
X.registerModule("managers/cpVariablesManager", ["managers/utils", "managers/hook", "elements/captivate", "managers/cpExtraActions"], function () {

  /////////////////////////////
  ////////// Variables
  var hasCpExtra = X.captivate.hasCpExtra();
  var fakeVariables = new X.classes.CallbackObject();

  X.cpVariablesManager = {

    "listenForVariableChange": (hasCpExtra) ? X.captivate.extra.variableManager.listenForVariableChange
                                              : fakeVariables.callback,

    "setVariableValue": (hasCpExtra) ? X.captivate.extra.variableManager.setVariableValue
                                       : fakeVariables.setProp,

    "getVariableValue": (hasCpExtra) ? X.captivate.extra.variableManager.getVariableValue
                                       : fakeVariables.getProp,

    "hasVariable": (hasCpExtra) ? X.captivate.extra.variableManager.getVariableValue
                                  : fakeVariables.hasProp,

	"stopListeningForVariableChange": (hasCpExtra) ? X.captivate.extra.variableManager.stopListeningForVariableChange
									               : fakeVariables.removeCallback
  }

	/////////////////////////////////////////
	///////////////// UNLOAD
	//
	//
	// We want to make sure we unload all the variable listeners when the iframe
	// is unloaded. This is so that we don't get an error where CpExtra
	// calls code in an already unloaded iFrame
	var listenerList = {};
	
	// So first we need to spy on all the listeners being added and record them
	// in a list
	X.addHook(X.cpVariablesManager, "listenForVariableChange", function (key, value) {
		listenerList[key] = value;
	});
	
	// Then when we are informed of the movie unload we will
	// loop through the list and unload all the listeners.
    X.cpExtraActions.register("unload", function () {

		X.utils.forEach(listenerList, function (key, value) {

			X.cpVariablesManager.stopListeningForVariableChange(key, value);

		});
	
	});
});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:58 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/dispatchLoadedEvent", function () {

    "use strict";

    var CPMATE_LOADED = "cpmateLoaded";

    function createEvent (name) {

        var event;

        if (typeof(Event) === 'function') {

            event = new Event(name);

        } else{

            event = document.createEvent('Event');
            event.initEvent(name, true, true);

        }

        return event

    }

    return function () {

        window.dispatchEvent(createEvent(CPMATE_LOADED));

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 1:22 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/11/15
 * Time: 11:13 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/hook", function () {

    "use strict";

    var hooks = [];

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE FUNCTIONS
    ///////////////////////////////////////////////////////////////////////


    function createHook(location, methodName, hookMethod) {

        var data = {
            "location": location,
            "methodName": methodName,
            "hookMethod": hookMethod,
            "originalMethod": location[methodName]
        };

        data.location[data.methodName] = function () {


            var returnValue,
                applyObject = arguments;

            if (data.callHookBeforeOriginal) {

                returnValue = data.hookMethod.apply(this, arguments);

                if (Object.prototype.toString.call( returnValue ) === '[object Arguments]') {
                    applyObject = returnValue;
                } else if (returnValue !== undefined) {
                    return returnValue;
                }

                return data.originalMethod.apply(this, applyObject);

            } else {

                returnValue = data.originalMethod.apply(this, applyObject);
                data.hookMethod.apply(this, arguments);
                return returnValue;

            }


        };

        hooks.push(data);

        return data;
    }

    function destroyHookAtIndex(index) {

        var data = hooks[index];

        if (data) {

            hooks.splice(index, 1);
            data.location[data.methodName] = data.originalMethod;

        }

    }

    function destroyHookIfExists(location, methodName) {
        destroyHookAtIndex(getHookIndex(location, methodName));
    }

    function getHookIndex(location, methodName, hookMethod) {

        var data;

        for (var i = 0; i < hooks.length; i += 1) {
            data = hooks[i];

            if (data.location === location &&
                data.methodName === methodName &&
                (!hookMethod || data.hookMethod === hookMethod)) {

                return i;

            }
        }

        return -1;
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// PUBLIC FUNCTIONS
    ///////////////////////////////////////////////////////////////////////



    X.addHookAfter = function (location, methodName, hookMethod) {

        var data = createHook(location, methodName, hookMethod);

        data.callHookBeforeOriginal = false;

    };

    X.addHookBefore = function (location, methodName, hookMethod) {

        var data = createHook(location, methodName, hookMethod);

        data.callHookBeforeOriginal = true;

    };

    // Same behaviour as after.
    X.addHook = X.addHookAfter;

    X.hasHook = function (location, methodName) {

        return getHookIndex(location, methodName) > -1;

    };

    X.removeHook = function (location, methodName, hookMethod) {

        var index = getHookIndex(location, methodName, hookMethod);

        if (index > -1) {

            destroyHookAtIndex(index);
            return true;

        }

        return false;

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// One Time Hooks
    ///////////////////////////////////////////////////////////////////////
    X.addOneTimeHook = function (location, methodName, hookMethod) {

        var handler = function () {

            hookMethod.apply(this, arguments);
            X.removeHook(location, methodName, handler);

        };

        X.addHookAfter(location, methodName, handler);

    };

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule(
  "managers/mouseEvents",
  ["managers/utils", "elements/slideObject", "elements/animate"],
  function() {
    "use strict";

    ///////////////////////////////////////////////////////////////////////
    ////////////// PUBLIC INTERFACE
    ///////////////////////////////////////////////////////////////////////

    var mobileEvents = {
      mousemove: "touchmove",
      // Stragely, once createjs.Touch is enabled although the other
      // touch events need to be used, mouse down does not
      // Go figure
      // "mousedown":"touchstart",
      mouseup: "touchend"
    };

    X.events = {
      getSafeEvent: function(eventName) {
        if (X.utils.isMobile && mobileEvents.hasOwnProperty(eventName)) {
          return mobileEvents[eventName];
        }
        return eventName;
      }
    };

    ///////////////////////////////////////////////////////////////////////
    ////////////// ENABLE FOR MOBILE
    ///////////////////////////////////////////////////////////////////////
    var result = createjs.Touch.enable(X.animate.stage, true);

    ///////////////////////////////////////////////////////////////////////
    ////////////// HANDLE DOCUMENT EVENTS
    ///////////////////////////////////////////////////////////////////////

    var listeners = [];

    if (!X.slideObject || !X.slideObject.proxy) {
      return;
    }

    function dispatchOnSlideObject(event) {
      X.slideObject.proxy.dispatchEvent(event);
    }

    function forwardEvent(eventName) {
      var safeEventName = X.events.getSafeEvent(eventName);

      function handler() {
        dispatchOnSlideObject(safeEventName);
      }

      listeners.push({
        eventName: safeEventName,
        handler: handler
      });

      document.addEventListener(safeEventName, handler);
    }

    [
      "click",
      "doubleclick",
      "contextmenu",
      "mouseover",
      "mouseout",
      "mousemove",
      "mousedown",
      "mouseup"
    ].forEach(function(eventName) {
      forwardEvent(eventName);
    });

    ////////////////////////////////////////
    ////////// HANDLE ANIMATION READY EVENT
    ////////////////////////////////////////
    // This should really be in another file
    // But I'm having a bad day and just want to get this fixed
    // so I can move on to something less misserable
    X.animate.callWhenLoaded(function() {
      dispatchOnSlideObject("animationready");
    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// Unload
    ///////////////////////////////////////////////////////////////////////
    X.broadcast.addCallback("unload", function() {
      listeners.forEach(function(data) {
        document.removeEventListener(data.eventName, data.handler);
      });

      listeners = null;
    });
  }
);

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 10:45 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie", ["elements/animate", "managers/hook"], function () {

    var rootTimeline = (function () {

        var play,
            gotoFrame

        return {
            "isMock": true,
            "play": function () {
                play = true;
            },
            "stop": function () {
                play = false;
            },
            "gotoAndPlay": function (frame) {
                gotoFrame = frame;
            },
            "enact": function () {
                if (play !== undefined) {

                    if (play) {
                        X.movie.play();
                    } else {
                        X.movie.stop();
                    }

                }

                if (gotoFrame !== undefined) {
                    X.movie.gotoAndPlay(gotoFrame);
                }
            }
        }
    }());

    X.movie = {
        "changeCallback": new X.classes.Callback(),
        "play": function () {
            rootTimeline.play();
            X.movie.changeCallback.sendToCallback("play");
        },
        "stop": function (reason) {
            rootTimeline.stop(reason);
            X.movie.changeCallback.sendToCallback("stop", reason);
        },
        "gotoAndPlay": function (frame) {
            rootTimeline.gotoAndPlay(frame);
            rootTimeline.play();
        },
        "isPaused": function () {
            return rootTimeline.paused;
        },

        "getLabels": function () {
            if (rootTimeline.labels) {
                return rootTimeline.labels
            }
            return [];
        },

        ///////////////////////////////////////////////////////////////////////
        /////////////// Get root timeline
        ///////////////////////////////////////////////////////////////////////
        "_setRootTimeline": function (timeline) {

            var oldTimeline = rootTimeline;
            rootTimeline = timeline;

            if (oldTimeline.isMock) {
                oldTimeline.enact();
            }

            X.movie.pause.setRootTimeline(timeline);

        }
    };

    X.animate.callWhenLoaded(function () {

        if (rootTimeline.isMock && X.movie.rootTimeline) {
            X.movie.rootTimeline.set(X.animate.mainTimeline);
        }

    });

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/preferences", function () {

    function Preferences() {

    }

    X.preferences = {
        "define":function (data) {

            var value,
                setMethod = function (incomingValue) {

                    if (value !== incomingValue) {

                        value = incomingValue;

                        if (data.animateRequired) {

                            X.animate.callWhenLoaded(function () {

                                data.method(value);

                            });

                        } else {
                            data.method(value);
                        }

                    }

                };

            Object.defineProperty(Preferences.prototype, data.name, {
                "get":function () {
                    return value;
                },
                "set":setMethod
            });

            if (data.default){
                setMethod(data.default);
            }

        }
    };

    return function () {
        X.preferences = new Preferences();
    };
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/4/19
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/runInCaptivateWindow", ["elements/captivate"], function () {

    "use strict";

    /**
     * Accepts a function to be run in the Captivate window context.
     * In order to avoid duplicating execution of code due to the
     * CpMate window being loaded multiple times, the ID parameter
     * is provided.
     * CpExtra will keep track of the code and the IDs, making sure
     * that once code associated with one ID has run, the next time
     * X.runInCaptivateWindow is called with that ID, that code will
     * NOT run.
     * @param func
     * @param id
     */
    X.runInCaptivateWindow = function (func, id) {

        if (X.captivate.extra) {

            var code = "(" + func.toString() + "())";

            if (code) {

                X.captivate.extra.safeEval(code, id);

            }

        }

    };

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 12:19 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/utils", function () {

    "use strict";

	function curry (numParams, method) {

		function mergeParams (oldParams, newParams) {

			var params = [];

			oldParams.forEach(function (param) {

				if (param === X.utils.__ &&
					newParams.length > 0) {

					params.push(newParams.shift());

				} else {

					params.push(param);

				}

			})

			return params.concat(newParams);

		}

		function getTrueParamsLength (params) {

			return X.utils.reduce(function (value, acc) {

				if (value === X.utils.__) {
					return acc;
				} else {
					return acc + 1;
				}

			}, 0, params);
		}

		function innerCurry (params, args) {

			var argumentsArray = Array.prototype.slice.call(args);
			params = mergeParams(params, argumentsArray);
			
			if (getTrueParamsLength(params) >= numParams) {
				return method.apply(null, params);
			} else {
				return callInnerCurry(params);
			}

		}

		function callInnerCurry (params) {

			return function () {

				return innerCurry(params, arguments);

			}

		}

		return callInnerCurry([]);

	};

    X.utils = {

      "isMobile": 'ontouchstart' in document.documentElement,

        "callIfDefined": function (method) {
            if (method) {
                var args = Array.prototype.slice.call(arguments);
                args = args.splice(1, args.length);

                return method.apply(null, args);
            }
        },

        "onNextTick": function (func) {
            return function () {

                var args = arguments;

                if (!createjs || !createjs.Ticker) {
                    return;
                }

                createjs.Ticker.on("tick", function () {
                    func.apply(null, args);
                }, null, true);

            };
        },

        "singleton": function (func) {
            var hasBeenCalled = false;

            return function () {

                if (!hasBeenCalled) {
                    func.apply(null, arguments);
                    hasBeenCalled = true;
                }

            }
        },

        "hasSuffix": function (string, suffix) {
            var ending = string.substring(string.length - suffix.length , string.length);
            return ending === suffix;
        },

        "callByType": function (parameter, methods) {

            switch (typeof parameter) {

                case "string":
                    return X.utils.callIfDefined(methods.string, parameter);

                case "number":
                    return X.utils.callIfDefined(methods.number, parameter);

                case "object":

                    if (parameter.constructor === Array) {
                        return X.utils.callIfDefined(methods.array, parameter);
                    } else {
                        return X.utils.callIfDefined(methods.object, parameter);
                    }

            }

        },


        "isEmpty": function (parameter) {
            return X.utils.callByType(parameter, {

                "object": function (p) {
                    return Object.keys(p).length <= 0;
                },

                "array": function (p) {
                    return p.length <= 0;
                }

            })
        },

        "filter": function (sequence, condition) {


            var types = {


                "array": function (array) {

                    var newArray = [];

                    array.forEach(function (element) {

                        if (condition(element)) {
                            newArray.push(element);
                        }

                    });

                    return newArray;

                },



                "object": function (object) {

                    var newObject = {};

                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {

                            if (condition(key, object[key])) {

                                newObject[key] = object[key];

                            }

                        }
                    }

                    return newObject;

                },



                "string": function (string) {

                    var newString = "",
                        letter;

                    for (var i = 0; i < string.length; i += 1) {

                        letter = string[i];

                        if (condition(letter)) {
                            newString += letter
                        }
                    }

                    return newString;

                }
            };



            return X.utils.callByType(sequence, types);

        },

        "forEach": function (sequence, method) {
            X.utils.callByType(sequence, {

                "array":function (array) {

                    array.forEach(method);

                },

                "object":function (object) {

                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {

                            method(key, object[key]);

                        }
                    }

                }

            });
        },

		"forEachUntil": curry(3, function (predicate, loop, list) {

            return X.utils.callByType(list, {

				"array": function () {

					for (var i = 0; i < list.length; i += 1) {

						var result = loop(list[i]);

						if (predicate(result)) {
							return result;
						}

					}

				},



				"object": function () {

					for (var key in list) {
						if (list.hasOwnProperty(key)) {

							var result = loop(list[key]);

							if (predicate(result)) {
							
								return result;

							}

						}
					}

				}

			});

		}),

		"forEachUntilResult": function (loop, list) {

			function predicate (value) {

				return value !== undefined;

			}
			

			return X.utils.forEachUntil(predicate, loop, list);

		},

		"identity": function (value) {

			return value;

		},

		"T": function () {

			return true;

		},

		"F": function () {

			return false;

		},

		"pipeLog": function (value) {

			console.log(value);

			return value;

		},

		"any": curry(2, function (predicate, list) {

			return X.utils.pipe(
				X.utils.forEachUntil(
					X.utils.identity,
					predicate
				),
				X.utils.when(
					X.utils.isNil,
					X.utils.F
				)
			)(list);

		}),

        "defaultTo": function (def, obj) {

            X.utils.forEach(def, function (key, value) {

                if (value !== null &&
                    typeof value === "object") {

                  var originalObj = obj[key];

                  if (!originalObj) {
                    originalObj = {};
                  }

                  obj[key] = X.utils.defaultTo(value, originalObj);

                } else if (!obj.hasOwnProperty(key)) {
                  obj[key] = value;
                }

            });

            return obj;

        },

        "getMissingProps": function (props, obj) {

          var result = [];

          X.utils.forEach(props, function (value) {

            if (!obj.hasOwnProperty(value)) {
              result.push(value);
            }

          });

            return result;
        },

		"ifElse": function (predicate, trueF, falseF) {
			
			return function () {
				if (predicate.apply(null, arguments)) {
					return trueF.apply(null, arguments);
				} else {
					return falseF.apply(null, arguments);
				}
			}

		},	

		"when": function (predicate, method) {
			
			return X.utils.ifElse(predicate, method, X.utils.identity);

		},

		
		"unless": function (predicate, method) {
			
			return X.utils.ifElse(predicate, X.utils.identity, method);

		},

		"getPercent": function (min, max, value) {
			
			var range = max - min;
			var diffFromMin = value - min;
			return diffFromMin / range;

		},

		"minMax": function (min, max, value) {
			
			value = Math.min(value, max);
			value = Math.max(value, min);
			return value;

		},

		"calculatePercentInRange": function (min, max, percent) {
			
			var range = max - min;
			var value = range * percent;
			return value + min;

		},

		"reduce": function (method, initialValue, list) {

			X.utils.forEach(list, function(value) {

					initialValue = method(value, initialValue);

				}
			);

			return initialValue;

		},

		"within": curry(3, function (start, end, value) {

			return value >= start && value <= end;

		}),
			
		"both": function (predicateA, predicateB) {

			return function (value) {

				return predicateA(value) && predicateB(value);

			}

		},

		"either": function (predicateA, predicateB) {

			return function (value) {

				return predicateA(value) || predicateB(value);

			}

		},

		"map": curry(2, function (method, data) {

            return X.utils.callByType(data, {




				"array": function () {

					var returnArray = [];

					X.utils.forEach(data, function (item) {

						var result = method(item);
						returnArray.push(result);

					})

					return returnArray;
				},




				"object": function () {

					var returnObject = {};

					X.utils.forEach(data, function (key, item) {

						var result = method(item);
						returnObject[key] = result;

					});

					return returnObject;

				}





			});

		}),

		"__": {},

		"curry": curry, 

		"pipe":function () {

			var argumentsArray = Array.prototype.slice.call(arguments);

			return function (input) {

				return X.utils.reduce(function (method, input) {

					return method(input);

				}, input, argumentsArray);

			}
				

		},

		"complement": function (method) {

			return function () {

				var result = method.apply(null, arguments); 

				if (typeof result === "function") {
					return X.utils.complement(result);	
				} else {
					return !result;
				}

			}

		},

		"removeWhiteSpace": function (string) {

			if (typeof string === "string") {
			
				return string.replace(/\s/g, "");

			}

		},

		"split": curry(2, function (character, string) {

			if (character && string) {
			
				return string.split(character);
			
			}

		}),

		"isType": curry(2, function (type, data) {

			return typeof data === type;

		}),

		"isNil": function (value) {

			return value === "" || value === null || value === undefined || 
				   (isNaN(value) && typeof value === "number");

		},

		"invert": function (value) {

			return !value;

		},

		"isIndexEmpty": curry(2, function (index, array) {

			return X.utils.isNil(array[index]);

		}),

		"isRange": function (string) {

			return X.utils.pipe(
				X.utils.getRangeObject,
				X.utils.isNil,
				X.utils.invert
			)(string);

		},

		"getRangeObject": function (string) {

			return X.utils.pipe(

				X.utils.removeWhiteSpace,

				X.utils.split("-"),

				X.utils.map(parseInt),

				function (rangeArray) {

					var isMinus = X.utils.isIndexEmpty(X.utils.__, rangeArray);

					switch (rangeArray.length) {

						
						// case 2:
							// This is not needed.
							// It's just here so that default
							// won't stop the function
							// break;

						case 3:

							if (isMinus(0)) {

								rangeArray = [
									rangeArray[1] * -1,
									rangeArray[2]
								];

							} else if (isMinus(1)) {
								
								rangeArray = [
									rangeArray[0],
									rangeArray[2] * -1
								]

							} else {
								rangeArray = null
							}

							break;

						case 4 :
							
							if (isMinus(0) && isMinus(2)) {
								rangeArray = [
									rangeArray[1] * -1,
									rangeArray[3] * -1
								];
							}

							break;
					}

					if (rangeArray === null) return [NaN];
					
					return {
						"start": rangeArray[0],
						"end": rangeArray[1]
					}

				},
				

				X.utils.when( 
					X.utils.any(X.utils.isNil),
					X.utils.always(null)
				)


			)(string);

		},

		"always": function (value) {

			return function () {

				return value;

			}

		}
    };

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/disableIFrameBorder", ["managers/preferences", "elements/slideObject"], function () {

    // This setting was created because I didn't know Captivate supplied settings to turn off its
    // default scrollbar and border when viewing web objects.

    X.preferences.define({
        "name":"disableIFrameBorder",
        "method":function (value) {

            if (!X.captivate.isLoaded()) {
                return;
            }

            if (value) {

                disableBorder();

            } else {

                enableBorder();

            }

        },
        "default":false
    });

    function disableBorder () {
        X.slideObject.div.style.border = "0px";
    }

    function enableBorder () {
        X.slideObject.div.style.border = "1px";
    }
});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/linkNameToLibrarySymbol", ["managers/preferences", "elements/slideObject", "managers/movie", "elements/animate"], function () {

    X.preferences.define({
        "name":"linkNameToLibrarySymbol",
        "animateRequired": true,
        "method":function (value) {

            if (isInvalid(value)) {
                return;
            }

            var name = getSlideObjectClassName();

            if (!name) {
                X.log("Could not find a symbol by the name of '" + getSlideObjectClassName() +
                      "'. Perhaps this animation is only included to preload other animations?");

                return;
            }

            X.movie.rootTimeline.set(name);

        },
        "default":false
    });




    function isInvalid (value) {
        return !value || !X.slideObject
    }


    function getSlideObjectClassName () {

        var name = X.slideObject.name;

        if (X.animate.library[name]) {

            return name;

        }

        // If we're here, we haven't found the correct name
        // Let's try seeing if there's an underscore at the end of the name
        var underscore = name.lastIndexOf("_");

        if (underscore > 0) {

            name = name.substring(0, underscore);

        }

        if (X.animate.library[name]) {

            // If this is not valid, the function we are returning this to will pick it up.
            return name;

        }

        return false;

    }

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 10:41 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/pausingInstanceSuffix", ["managers/preferences", "managers/utils"], function () {

    "use strict";

    var list,
        init = X.utils.singleton(function () {

            X.movie.changeCallback.addCallback("play", function () {
                X.utils.forEach(list, function (key, element) {

                    element.play();

                });
            });

            X.movie.changeCallback.addCallback("stop", function () {
                X.utils.forEach(list, function (key, element) {

                    element.stop();

                });
            })

        });


    X.preferences.define({
        "name":"pausingInstanceSuffix",
        "animateRequired": true,
        "method":function (suffix) {

            init();

            function reactToNewList () {

                list = X.movie.children.getListMatchingSuffix(suffix);

            }

            if (X.movie.children.exist) {
                reactToNewList();
            }

            X.movie.children.changeCallback.addCallback("*", reactToNewList);

        }
    });

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/29/18
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/preferences/preview", ["managers/preferences"], function () {

    "use strict";

    X.preferences.define({
        "name":"preview",
        "animateRequired": true,
        "method":function (symbolName) {

            if (X.captivate.isLoaded()) {
                return;
            }

            X.movie.rootTimeline.set(symbolName);

            document.addEventListener("click", X.movie.play);

        }
    });

});
/*

// The stage resize code from animate plus a couple of additions I've
// made to make it run correctly
//
// TODO: Find a way to edit this so the overflow is rendered too.

function makeResponsive(isResp, respDim, isScale, scaleType) {
		var lib = X.animate.library;
		var lastW, lastH, lastS=1;
		window.addEventListener('resize', resizeCanvas, true);
		resizeCanvas();
		function resizeCanvas(e) {
			if (e) e.preventDefault();
			var w = lib.properties.width, h = lib.properties.height;
			var iw = window.innerWidth, ih=window.innerHeight;
			var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;
			if(isResp) {
				if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {
					sRatio = lastS;
				}
				else if(!isScale) {
					if(iw<w || ih<h)
						sRatio = Math.min(xRatio, yRatio);
				}
				else if(scaleType==1) {
					sRatio = Math.min(xRatio, yRatio);
				}
				else if(scaleType==2) {
					sRatio = Math.max(xRatio, yRatio);
				}
			}
			canvas.width = //w*pRatio*sRatio;
			canvas.height = h*pRatio*sRatio;
			canvas.style.width = dom_overlay_container.style.width = anim_container.style.width =  w*sRatio+'px';
			canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h*sRatio+'px';
			stage.scaleX = pRatio*sRatio;
			stage.scaleY = pRatio*sRatio;
			lastW = iw; lastH = ih; lastS = sRatio;
			stage.tickOnUpdate = false;
			stage.update();
			stage.tickOnUpdate = true;
		}
	}
	makeResponsive(true,'both',true,1);
*/

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/10/18
 * Time: 3:57 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("useRAFTiming", ["managers/preferences"], function () {

    "use strict";

    X.preferences.define({
        "name":"useRAFTiming",
        "animateRequired": true,
        "method":function (value) {

            if (!createjs || !createjs.Ticker) {
                console.error("Tried to change createjs.Ticker timing mode before it was loaded");

                return;
            }

            if (value) {

                createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

            } else {

                createjs.Ticker.timingMode = null;

            }

        },
        "default":true
    });



});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/exitslide", ["managers/cpExtraActions"], function () {

    "use strict";

    X.cpExtraActions.register("exitslide", function () {

        // Have yet to have a need to react to this event
        // Unloading is handled by the 'unload' cpExtraAction
        // However, we still have to define this, otherwise we will get an alert message
        // When CpExtra tries to call this action and nothing is defined for it.

    });

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/gotoFrameLabel", ["managers/cpExtraActions"], function () {

    "use strict";

    if (!X.cpExtraActions) {
        return;
    }

    function gotoFrameLabel (frameLabel) {

		console.log("Going to label: " + frameLabel);
        var labels = X.movie.getLabels(),
            labelData;

        frameLabel = frameLabel.toString();

        for (var i = 0; i < labels.length; i += 1) {

            labelData = labels[i];

            if (labelData.label === frameLabel) {
                X.movie.gotoAndPlay(labelData.position);
                return;
            }

        }

    }



    ///////////////////////////////////////////////////////////////////////
    /////////////// REGISTER
    ///////////////////////////////////////////////////////////////////////

    X.cpExtraActions.register("gotoFrameLabel", function (frameLabel) {

        // Make sure the animate runtime has already loaded.
        X.animate.callWhenLoaded(function () {

            gotoFrameLabel(frameLabel);

        })

    });

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/playAndStop", ["managers/cpExtraActions"], function () {

    "use strict";

    if (!X.cpExtraActions) {
        return;
    }


    function registerAndCallWhenLoaded (name, method) {

        X.cpExtraActions.register(name, function () {

            // Make sure the animate runtime has already loaded.
            X.animate.callWhenLoaded(function () {

                method();

            })

        });

    }

    registerAndCallWhenLoaded("movieResume", function () {

        if (X.movie.isPaused() &&
            X.movie.pause.reason === X.movie.pause.type.CAPTIVATE_PAUSED) {

            X.movie.play();

        }

    });

    registerAndCallWhenLoaded("moviePause", function () {

        if (!X.movie.isPaused()) {

            X.movie.stop(X.movie.pause.type.CAPTIVATE_PAUSED);

        }

    });



});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/unload", ["managers/cpExtraActions"], function () {

    "use strict";

    X.cpExtraActions.register("unload", handleUnload);

    window.addEventListener("unload", handleUnload);

    function handleUnload () {

        window.removeEventListener("unload", handleUnload);

        X.cpExtraActions.unload();

        X.broadcast.sendToCallback("unload");
    }

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/debugging/errors", function () {

    X.errors = {

        ///////////////////////////////////////////////////////////////////////
        /////////////// GENERAL ERRORS (GE)
        ///////////////////////////////////////////////////////////////////////

        "GE001":function () {
            return "You have not loaded CpExtra into Captivate. CpMate cannot work if CpExtra is not installed in Captivate. Either install CpExtra or remove CpMate.";
        },

        "GE002": function (currentVersion, minimumVersion) {
            return "CPEXTRA NEEDS TO BE UPGRADED. The current version of CpExtra is " + currentVersion + ". But the minimum version of CpExtra needed to work with CpMate is " + minimumVersion + ". PLEASE UPGRADE CPEXTRA NOW."
        },

        ////////////////////////////////////////
        ////////// COMPONENT ERRORS
        ////////////////////////////////////////
        "CO001": function (property) {
            return "The required property for slider/dial data ''" + property + "'' was not provided";
        },
        "CO002": function (name) {
            return "The variable defined for the slider/dial interaction '" + name + "' does not exist'";
        },
		"CO003": function (propertyName) {
			return "The evaluate settings for a slider/dial interaction did not have the required '" + propertyName + "' property defined.";
		},

		////////////////////////////////////////
		////////// PREFIX ERRORS
		////////////////////////////////////////
		"PR001": function (clipName) {
			return "Could not find a matching variable for movie clip named: '" + clipName + "'";
		}
    };

});

/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 9:46 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/debugging/logging", ["managers/debugging/errors"], function () {

    X.log = function (message) {
        console.log(message);
    };

    X.alert = function (message, title) {
        if (X.captivate.isLoaded()) {
            X.captivate.alert(message, title);
        } else {
            alert(message);
        }
    };

    X.error = function (errorCode, message) {

        var title = "CpMate Error";

        if (X.errors.hasOwnProperty(errorCode)) {

            // Get array of all arguments except the first one.
            // We will need to pass this on to the error function.
            var args = Array.prototype.slice.call(arguments);
            args.splice(0,1);

            message = X.errors[errorCode].apply(this, args);

            title += ": " + errorCode;

        } else {

            message = errorCode;

        }

        X.alert(message, title);

    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/children", ["managers/movie/rootTimeline", "managers/utils"], function () {

    "use strict";

    X.movie.children = {
        "list":{},
        "changeCallback": new X.classes.Callback(),
        "exist": false,
        "getListMatchingSuffix": function (suffix) {

            return X.utils.filter(X.movie.children.list, function (name, value) {

                return X.utils.hasSuffix(name, suffix);

            });

        }
    };

    function getDeepListOfChildren (timeline) {

        var newChildren = {};

        function addChild (child) {
            if (child.name && !newChildren.hasOwnProperty(child.name)) {
                newChildren[child.name] = child;
            }
        }


        function inspectChildren (parent) {

            addChild(parent);

            parent.children.forEach(function (child) {

                if (child.children && child.children.length > 0) {

                    inspectChildren(child);

                } else {

                    addChild(child);

                }

            })

        }

        if (timeline.children) {
            inspectChildren(timeline);
        }

        return newChildren;

    }



    function handleNewTimeline (timeline) {

        X.movie.children.list = getDeepListOfChildren(timeline);

        X.movie.children.exist = !X.utils.isEmpty(X.movie.children.list);

        X.movie.children.changeCallback.sendToCallback("*");

    }

    X.movie.rootTimeline.changeCallback.addCallback("*", X.utils.onNextTick(handleNewTimeline));

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/22/18
 * Time: 1:29 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/pause", ["managers/movie"], function () {

    "use strict";

    var rootTimeline;

    X.movie.pause = {

        "type": {
            "FRAME_SCRIPT":"frame_script",
            "CAPTIVATE_PAUSED":"captivate_paused"
        },

        "setRootTimeline": function (timeline) {

            if (rootTimeline) {
                X.removeHook(rootTimeline, "stop", reactToPause);
            }

            rootTimeline = timeline;

            X.addHook(rootTimeline, "stop", reactToPause);

        },

        "reason":null
    };

    function reactToPause (reason) {

        if (!reason) {
            reason = X.movie.pause.type.FRAME_SCRIPT;
        }

        X.movie.pause.reason = reason;

    }

});
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/29/18
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/rootTimeline", ["managers/movie", "classes/Callback"], function () {

    "use strict";

    X.movie.rootTimeline = {

        "changeCallback": new X.classes.Callback(),

        "set":function (symbolName) {

            if (!X.animate || !X.animate.library) {
                console.log("Tried to set root timeline before animate loaded");
                return;
            }

            if (typeof symbolName !== "string") {

                // We're not processing a symbol name, we're processing a full timeline
                setTimeline(symbolName);
                return;

            }

            if (!X.animate.library.hasOwnProperty(symbolName)) {
                X.error("Could not find symbol with name " + symbolName +
                        " in library. Therefore was unable to add it as root timeline.");

                return;
            }

            var instance = new X.animate.library[symbolName]();
            X.animate.mainTimeline.addChild(instance);
            setTimeline(instance);


            function setTimeline (timeline) {
                X.movie._setRootTimeline(timeline);
                X.movie.rootTimeline.changeCallback.sendToCallback("*", timeline);
            }


        }

    };

});
X.registerModule("managers/prefix/displayObjectName", ["managers/movie/children", "managers/utils"], function () {
	
	// Variables
	var callbacks = {};
	var alreadyCalledBack = {};

	// Methods
	X.registerDisplayObjectNamePrefix = function (prefix, callback) {
		callbacks[prefix] = callback;
		callbacks[prefix.toLowerCase()] = callback;
	}

	function onChildListUpdate () {

		X.utils.forEach(X.movie.children.list, function (name, movieClip) {

			// If we have already called a callback because of this
			// movie clip, then we should not continue
			if (alreadyCalledBack[name] === movieClip) {
				return;
			}

			// Get prefix
			var prefix = name.split("_")[0];

			// If we have something registered for this prefix
			if (callbacks.hasOwnProperty(prefix)) {

				// Make a note in the alreadyCalledBack list
				// so we don't call this again
				alreadyCalledBack[name] = movieClip;

				// Call the callback
				callbacks[prefix](movieClip);
			}

		});

	}

	X.movie.children.changeCallback.addCallback("*", onChildListUpdate);

	
});

X.registerModule(
  "managers/prefix/displayObjectNameAndVariable",
  ["managers/prefix/displayObjectName"],
  function() {
    ///////// UTIL
    function getVariableName(name) {
      // xfoobar, my, var, name
      var nameSplit = name.split("_");
      // my, var, name
      var nameSplitMinusStart = nameSplit.splice(1, nameSplit.length - 1);

      createVariableIfNotInCaptivate(nameSplitMinusStart);

      var validVarName = loopThroughVarNames(nameSplitMinusStart);

      if (validVarName) {
        return validVarName;
      } else {
        X.error("PR001", name);
      }
    }

    function createVariableIfNotInCaptivate(nameSections) {
      if (!X.captivate.hasCpExtra()) {
        var varName = buildVariableNameFromArray(nameSections);
        X.cpVariablesManager.setVariableValue(varName, "");
      }
    }

    function loopThroughVarNames(nameSections) {
      var i = nameSections.length - 1;
      var workingSections;
      var splicedSections;
      var variableName;

      while (i >= 0) {
        workingSections = nameSections.concat();
        splicedSections = workingSections.splice(0, i + 1);
        variableName = buildVariableNameFromArray(splicedSections);

        if (X.cpVariablesManager.hasVariable(variableName)) {
          return variableName;
        }

        i--;
      }

      return null;
    }

    function buildVariableNameFromArray(varNameArray) {
      var almostVariableName = X.utils.reduce(
        makeVariableName,
        "",
        varNameArray
      );
      return almostVariableName.substring(1, almostVariableName.length);
    }

    function makeVariableName(value, acc) {
      return acc + "_" + value;
    }

    ///////// ENTRY POINT
    X.registerDisplayObjectNamePrefixAndVariable = function(prefix, callback) {
      // Get informed when a movieClip matching our prefix appears
      X.registerDisplayObjectNamePrefix(prefix, function(movieClip) {
        /////////// ASSISTANT METHODS
        function updateCallback() {
          var value = X.cpVariablesManager.getVariableValue(variableName);
          // Inform the originally passed in callback
          callback(movieClip, value);
        }

        // Interpret variable name from movie clip name
        var variableName = getVariableName(movieClip.name);

        // If we can't find variable then stop here
        if (!variableName) return;

        // listen for variable change
        X.cpVariablesManager.listenForVariableChange(
          variableName,
          updateCallback
        );

        // Update the callback now with the current variable value
        var currentValue = X.cpVariablesManager.getVariableValue(variableName);

        updateCallback(currentValue);
      });
    };
  }
);

X.registerModule("managers/components/slider/controller", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.controller = function (view, model, data) {

	////////////////////// 
	////// Variable
	var evaluateManager;
	var lastHandleX = data.handle.x;
	var lastHandleY = data.handle.y;
	
	////////////////////// 
	////// Assistant methods
	function gtx () {
		return X.animate.stage.mouseX;
	}

	function gty () {
		return X.animate.stage.mouseY;
	}

	function hasHandleMoved () {

		if (lastHandleX === data.handle.x &&
		    lastHandleY === data.handle.y) {
			
			return false;

		}

		lastHandleX = data.handle.x;
		lastHandleY = data.handle.y;

		return true;
	}


	/////////////////////
	////// Entry point

	function init() {
		addHandlers();
		addEvaluate();
	}

	function addHandlers() {
		
		var safeMouseMove = X.events.getSafeEvent('mousemove');
		var safeMouseUp = X.events.getSafeEvent('mouseup');
		var safeMouseDown = X.events.getSafeEvent('mousedown');

		view.listenToTrack(safeMouseDown, function () {
			
		});



		// MOUSE DOWN HANDLER
		view.listenToHandle(safeMouseDown, function () {

			model.dragStart(gtx(), gty());

			// MOUSE MOVE HANDLER
			function moveHandler() {
				model.dragMove(gtx(), gty());
				if (hasHandleMoved()) {
					evaluateManager.dragMove();
				}
			}

			// MOUSE UP HANDLER
			function upHandler() {
				model.dragEnd();
				evaluateManager.dragEnd();
				document.removeEventListener(safeMouseMove, moveHandler);
				document.removeEventListener(safeMouseUp, upHandler);
			}

			// MOUSE MOVE LISTENER
			document.addEventListener(safeMouseMove, moveHandler);
			document.addEventListener(safeMouseUp, upHandler);
		});
	}

	function addEvaluate () {

		if (data.evaluate) {
		
			evaluateManager = X.slider.evaluate(data.evaluate, data.variable);
		
		} else {
		
			// Create a dummy so we don't have to define a heap of if statements
			evaluateManager = {
				"dragMove": function () {},
				"dragEnd": function () {}
			}
		
		}

	}
	
	init();

    return {
	
	};
  }

});

/**
 *
 * @module X.slider.evaluate()
 *
 * Handles the settings we pass for when to evaluate a component (such as a slider)
 *
 * Expected settings include the following:
 *
 *
 * @param {Object} data - (required) A JSON object which provides the settings
 * @param {string} data.on - (required) The circumstance under which the evaluation should occur. Valid values include 'continually', 'mouse up', or 'button'.
 * @param {MovieClip} data.button - If data.on is set to 'button', we use this property to define which movie clip will act as a button. When that movie clip is clicked, evaluation will be triggered
 * @param {Array} data.criteria - (required) an array of the different situations and what to do in them. For more info see the criteria module.
 *
 * @example
 * X.slider({
 *	"track": this.track,
 *	"handle": this.handle,
 *	"variable": "myvar",
 *	"evaluate":{
 *		"on": "button",
 *		"button": this.submitbutton,
 *		"criteria":[
 *			{
 *				"if":"default",
 *				"then":"HAN_default_action" // Name of interactive object in Captivate whose success action we'll use
 *			},
 *			{
 *				"if": "10-15, 21, 30-60",
 *				"then": function () {
 *					some_variable = true;
 *					return "HAN_success_action" // This action will be called
 *				}
 *			},
 *			{
 *				"if": 20,
 *				"then": false // Do nothing
 *			}
 *		]
 *	}
 * });
 */ 
X.registerModule("managers/components/slider/evaluate", ["managers/mouseEvents", "managers/utils", "managers/components/slider/validator"], function () {
	
	X.slider.evaluate = function (data, variableName) {

		////////////////////////////////////////
		////////// setup
		////////////////////////////////////////

		////////////////////////////////////////
		////// variables
		var criteriaEvaluateMethods = [];
		var defaultEvaluateMethod;
		var matchMaker = function (term) {

			return function () {
				if (!data.on) return false;
				return data.on.toLowerCase() === term;
			}

		};
		var onContinually = matchMaker("continually");
		var onMouseUp = matchMaker("mouseup");
		var onButton = matchMaker("button");
		var onContinuallyAndMouseUp = X.utils.either(onContinually, onMouseUp);
		
		
		////////////////////////////////////////
		////// methods
		
		function getVariable () {

			return X.cpVariablesManager.getVariableValue(variableName);

		}

		function callThen (then) {

			switch (typeof then) {

				case "function" :
					then();
					break;
					
				case "string" :
					if (X.captivate.hasCpExtra()) {
						X.captivate.extraCallActionOn(then)
					}
					break;

			}

		}
		

		////////////////////////////////////////
		////////// entry point
		////////////////////////////////////////
		
		var init = X.utils.when(isValid, function () {

			breakUpCommaDelimitedEvaluationMethods();
			associateCriteriaWithEvaluationMethod();
			listenForButton();

		});

		////////////////////////////////////////
		////// error checking
		
		function isValid () {

			if (!data.on) {
			
				X.error("CO003", "on");
				return false;

			}

			if (!data.criteria) {
			
				X.error("CO003", "criteria");
				return false;
			
			}
			
			return true;

		}

		////////////////////////////////////////
		////// break up comma delimited evaluation methods

		// This is for those cases where someone specifies a comma
		// delimited list of 'if' conditions like:
		// "criteria"[
		// 	{
		// 		"if": "1, 20, 45",
		// 		"then": "HAN_something"
		// 	}
		// 	]
		//
		// 	Under those circumstances we will break up the 'if' list
		// 	and create a criteria object for each of the specified 
		// 	conditions.
		//
		// 	So the end result will look like:
		// "criteria"[
		// 	{
		// 		"if": "1",
		// 		"then": "HAN_something"
		// 	},
		// 	{
		// 		"if": "20",
		// 		"then": "HAN_something"
		// 	},
		// 	{
		// 		"if": "45",
		// 		"then": "HAN_something"
		// 	}
		// 	]

		function breakUpCommaDelimitedEvaluationMethods () {

			var finalCriteriaList = [];

			X.utils.forEach(data.criteria, function (criteriaData) {
					
				var conditionList = getConditionsList(criteriaData.if);

				// If there is no list of conditions
				if (!conditionList.length || conditionList.length === 1) {
				
					finalCriteriaList.push(criteriaData);
				
				} else {
					// If there is a list of conditions
					var newCriteria = makeCriteriaForEachCondition(conditionList, criteriaData.then);

					finalCriteriaList = finalCriteriaList.concat(newCriteria);

				}

			}); 

		
			data.criteria = finalCriteriaList;

		}

		var getConditionsList = X.utils.when(

				// Is this a string?
				X.utils.isType("string"),

				// It's a string
				X.utils.pipe(
					X.utils.removeWhiteSpace,
					X.utils.split(",")
				)
			
			);

		function makeCriteriaForEachCondition (list, then) {

			return X.utils.map(function (condition) {

				return {
					"if": condition,
					"then":then
				}

			}, list);

		}

		////////////////////////////////////////
		////// format criteria data
		
		function associateCriteriaWithEvaluationMethod () {

			// Loop through all the criteria
			X.utils.forEach(data.criteria, function (criteriaData) {

				// Before starting though, we have to check if this is
				// the default
				if (criteriaData.if === "default") {
				
					defaultEvaluateMethod = criteriaData.then;

					// We don't want to continue
					return;
				}
				// Find build a method that will check if the criteria matches
				var matchesCriteria = getCriteriaValidMethod(criteriaData.if);

				// If no valid value, then we'll STOP HERE
				if(!matchesCriteria) return;

				// Add the evaluate method
				criteriaEvaluateMethods.push(function (value) {

					// If the criteria matches...
					if (matchesCriteria(value)) {
						// We'll call the THEN method and we win!!!!!
						callThen(criteriaData.then);

						return true;
					}

					// We'll need to track whether the criteria matches or not if we are going to
					// get the 'default' method to work
					return false;

				})

			})

		}
		
		function getCriteriaValidMethod (circumstance) {

			// Loop through the list of evalation methods that have been defined
			// in other code files
			return X.utils.forEachUntilResult(function (evaluateMethodData) {

				// If this method can process this condition
				if (evaluateMethodData.isValid(circumstance)) {
				
					// then we'll create a method which runs the circumstance
					// and latest variable value 
					return function (value) {

						return evaluateMethodData.method(circumstance, value);

					}
				
				}

			}, X.slider.evaluateMethods);

		}
		
		////////////////////////////////////////
		////// handle button

		function listenForButton () {

			if (onButton() && data.button) {
			
				data.button.addEventListener(X.events.getSafeEvent("click"), evaluate);
			
			}

		}
		

		////////////////////////////////////////
		////// evaluate
		function evaluate () {

			var value = getVariable();
			var hadSuccessfulEvaluate = false;

			X.utils.forEach(criteriaEvaluateMethods, function (evaluateMethod) {

				var result = evaluateMethod(value);

				if (result) {
					hadSuccessfulEvaluate = true;
				}

			});

			if (!hadSuccessfulEvaluate && defaultEvaluateMethod) {
				callThen(defaultEvaluateMethod);
			}

		}
		
		
		////////////////////////////////////////
		////// kick off entry point
		init();


		////////////////////////////////////////
		////// exports

		return {
			"dragMove": X.utils.when(onContinually, evaluate),
			// In theory the line above does the same as the function below
			// However, in unit tests the line above only works 50% of the time
			// while the line below works 100% of the time.
			// "dragMove": function () {

			// 	if (onContinually()) {
				
			// 		evaluate();
				
			// 	}

			// },

			"dragEnd": X.utils.when(onContinuallyAndMouseUp, evaluate)
			// "dragEnd": function () {

			// 	if (onContinuallyAndMouseUp()) {
				
			// 		evaluate();
				
			// 	}

			// }
		}
		
	}

});

X.registerModule(
  "managers/components/slider/model",
  ["managers/utils", "managers/components/slider/validator"],
  function() {
    X.slider.model = function(initialData) {
      /////////////////////////////
      ////////// private variables
      var updateView;
      var cpVarName = initialData.variable;
      var isCurrentlyDragging = false;
      var isVertical = initialData.orientation === "vertical";
      var mouseHandleOffset = 0;
      var data = {
        handlePosition: 0
      };
      var handle = new X.classes.DisplayObjectProxy(initialData.handle);
      var track = new X.classes.DisplayObjectProxy(initialData.track);

      if (isVertical) {
        handle.primary = "y";
        track.primary = "y";
      } else {
        handle.primary = "x";
        track.primary = "x";
      }

      var topLimit =
        track.primaryAxis + track.primaryLength - handle.primaryLength;
      var bottomLimit = track.primaryAxis;

      /////////////////////////////
      ////////// util functions
      function updateAfter(method) {
        return function() {
          method.apply(null, arguments);
          updateView(data);
        };
      }

      /////////////////////////////////
      /////////////// VARIABLE UPDATE

      var variableUpdate = X.utils.unless(
        // predicate
        function() {
          return isCurrentlyDragging;
        },
        // method
        updateAfter(function() {
          var value = X.cpVariablesManager.getVariableValue(cpVarName);
          data.handlePosition = transposeVariableValueToHandlePosition(value);
        })
      );

      function transposeVariableValueToHandlePosition(value) {
        var percent = X.utils.getPercent(
          initialData.min,
          initialData.max,
          value
        );
        var minMaxedPercent = X.utils.minMax(0, 1, percent);
        return X.utils.calculatePercentInRange(
          bottomLimit,
          topLimit,
          minMaxedPercent
        );
      }

      /////////////////////////////
      ////////// entry point
      function init() {
        handleNoCpExtra();

        if (!isValid()) return;

        X.cpVariablesManager.listenForVariableChange(cpVarName, variableUpdate);
      }

      function handleNoCpExtra() {
        if (!X.captivate.hasCpExtra()) {
          // If CpExtra is not loaded, we'll create a fake version of the variable
          // and set its default value to the minimum value.
          X.cpVariablesManager.setVariableValue(cpVarName, initialData.min);
        }
      }

      function isValid() {
        if (!X.cpVariablesManager.hasVariable(cpVarName)) {
          X.error("CO002", cpVarName);

          return false;
        }

        return true;
      }

      init();

      /////////////////////////////////
      /////////////// EXPORTS HELPERS

      function calculateHandleMove(loc) {
        loc = loc - mouseHandleOffset;
        loc = Math.min(loc, topLimit);
        loc = Math.max(loc, bottomLimit);
        return loc;
      }

      function updateCaptivateVariable(loc) {
        var percentage = X.utils.getPercent(bottomLimit, topLimit, loc);
        var rawValue = X.utils.calculatePercentInRange(
          initialData.min,
          initialData.max,
          percentage
        );
        var outputValue = Math.round(rawValue);

        X.cpVariablesManager.setVariableValue(
          initialData.variable,
          outputValue
        );
      }

      /////////////////////////////////
      /////////////// EXPORTS

      return {
        updateTo: function(method) {
          updateView = method;

          // Now that we have a method to update the view
          // We should do the initial check for the variable's value
          // And update the slider's position to match
          variableUpdate();
        },
        dragStart: function(x, y) {
          // We turn this on so if the Captivate Variable updates while we're dragging
          // We do not update the handle to its value.
          isCurrentlyDragging = true;

          if (isVertical) {
            mouseHandleOffset = y - handle.y;
          } else {
            mouseHandleOffset = x - handle.x;
          }
        },
        dragMove: updateAfter(function(x, y) {
          var axis;

          if (isVertical) {
            axis = y;
          } else {
            axis = x;
          }

          var handlePosition = calculateHandleMove(axis);
          updateCaptivateVariable(handlePosition);
          data.handlePosition = handlePosition;
        }),
        dragEnd: function() {
          // It is now safe for us to keep listening to the captivate variable update
          isCurrentlyDragging = false;
        }
      };
    };
  }
);

X.registerModule("managers/components/slider/registerEvaluateMethod", ["managers/components/slider/validator"], function () {
	
	X.slider.evaluateMethods = {};
	X.slider.registerEvaluateMethod = function (name, data) {

		X.slider.evaluateMethods[name] = data;

	}

});

X.registerModule("managers/components/slider/validator", ["managers/utils"], function () {

  /**
   * @module X.slider()
   *
   * Creates a slider interaction out of items MovieClips on the stage.
   *
   *
   * @param {Object} data - (required) A JSON object which provides the settings
   * @param {string} data.variable - (required) The Captivate Variable to which the slider will be bound
   * @param {number} data.min - The minimum value of the Captivate Variable. Equates to the lowest point of the slider.
   * @param {number} data.max - The maximum value of the Captivate Variable. Equates to the highest point of the slider.
   * @param {boolean} data.reverse - Indicates whether the location of the slider handle and the value it sends to the Captivate variable needs to have its min/max inverted.
   * @param {string} data.orientation - Either 'vertical' or 'horizontal'. Defines what direction the slider slides in.
   * @param {MovieClip} data.track - Instance of MovieClip on stage to act as slider track
   * @param {MovieClip} data.handle - Instance of MovieClip on stage to act as slider handle
   * @param {MovieClip} data.scrollUp - Instance of MovieClip on stage to act as up scroll arrow
   * @param {MovieClip} data.scrollDown - Instance of MovieClip on stage to act as down scroll arrow
   * @param {string} data.attachedItems - @syntax query of instances names to attach themselves to the handle and move with it
   * @param {boolean} data.trackClicking - Indicates whether a click on the track should move the handle to that location
   * @param {boolean} data.hideTrack - Indicates whether the track MovieClip should be hidden at runtime
   * @param {number} data.throwingFriction - If 0 there is no throwing. Otherwise, defines how quickly slider should come to a stop
   * @param {boolean} data.handCursor - Indicates whether a hand cursor should be shown over handle and track.
   * @param {boolean} data.scroll - Indicates whether should react to mouse wheel scroll.
   * @param {boolean} data.scrollWhenOver - Indicates whether should react to mouse wheel scroll when mouse is located on top of handle and track.
   * @param {boolean} data.scrollStep - Indicates how much the variable should be changed by for each step of the scroll wheel.
   * @param {Object} data.evaluate - Settings for slider evaluation (See the evaluate module for more details)
   * @return {null}
   */
  X.slider = function (data) {

    function init() {

      if (!isValid()) {
        return;
      }

      var safeData = defaultedData();

      wireUpMVC(safeData);

    }

    function isValid() {
      var missingProps = X.utils.getMissingProps(["variable", "handle", "track"], data);

      if (missingProps.length > 0) {

        X.utils.forEach(missingProps, function (propName) {
          X.error("CE001", propName);
        });

        return false;
      }

      return true;
    }


    function defaultedData() {
      return X.utils.defaultTo({
            "min": 0,
            "max": 100,
            "reverse": false,
			"orientation": "vertical",
            "hideTrack": false,
            "scrollUp": null,
            "scrollDown": null,
            "attachedItems": null,
            "trackClicking": false,
            "throwingFriction": 0,
            "handCursor": true,
            "scrollWhenOver": false,
            "scroll": false,
            "scrollStep": 10
      }, data);

    }

    function wireUpMVC(data) {

      var model = X.slider.model(data);
      var view = X.slider.view(data);
      X.slider.controller(view, model, data);
      model.updateTo(view.update);

    }
	
    // Return to entry point
    init();

  }

});

X.registerModule(
  "managers/components/slider/view",
  ["managers/utils", "managers/components/slider/validator"],
  function() {
    X.slider.view = function(initialData) {
      /////////////////////////////
      ////////// PRIVATE VARS
      var handle = initialData.handle;
      var track = initialData.track;
      var handleProxy = new X.classes.DisplayObjectProxy(handle);
      var trackProxy = new X.classes.DisplayObjectProxy(track);

      var orientation = getOrientation();
      var primaryAxis = orientation === "v" ? "y" : "x";

      handleProxy.primary = primaryAxis;
      trackProxy.primary = primaryAxis;

      /////////////////////////////
      ////////// ENTRY POINT
      function init() {
        alignHandleToTrack();
      }

      function getOrientation() {
        if (initialData.orientation === "vertical") {
          return "v";
        } else {
          return "h";
        }
      }

      /////////////////////////////
      ////////// ALIGN

      function alignHandleToTrack() {
        // align primary axises at '0' point.
        handleProxy.primaryAxis = trackProxy.primaryAxis;

        // center on secondary axis
        handleProxy.secondaryAxis =
          trackProxy.secondaryAxis +
          (trackProxy.secondaryLength - handleProxy.secondaryLength) / 2;
      }

      init();
      /////////////////////////////
      ////////// EXPORTS

      var exports = {
        track: initialData.track,
        handle: initialData.handle,
        listenToTrack: function(event, handler) {
          initialData.track.addEventListener(event, handler);
        },
        listenToHandle: function(event, handler) {
          initialData.handle.addEventListener(event, handler);
        },
        update: function(data) {
          handleProxy.primaryAxis = data.handlePosition;
        }
      };

      return exports;
    };
  }
);

X.registerModule("managers/prefixes/registees/xBind", ["managers/prefix/displayObjectNameAndVariable"], function () {
	
	function xBind (movieClip, value) {

		var proxy = new X.classes.MovieClipProxy(movieClip);

		// If the label is present
		if (proxy.hasLabel(value)) {
		
			var frame = proxy.getLabelFrame(value);

			proxy.gotoAndStop(frame);
		
		} else {
			
			// If there is no matching label, then stop at the first frame
			proxy.gotoAndStop(0);
		
		}

	}
	

	// Register for updates
	X.registerDisplayObjectNamePrefixAndVariable("xBind", xBind);

});

X.registerModule("managers/components/slider/evaluateMethods/equal", ["managers/components/slider/registerEvaluateMethod"], function () {
	
	X.slider.registerEvaluateMethod("equals", {
		
		"isValid": X.utils.complement(isNaN),

		"method": function (condition, value) {

			var conditionNum = parseInt(condition);
			var valueNum = parseInt(value);

			return conditionNum === valueNum;

		}
	
	});

});

X.registerModule("managers/components/slider/evaluateMethods/range", ["managers/components/slider/registerEvaluateMethod"], function () {
	
	X.slider.registerEvaluateMethod("range", {

		"isValid": X.utils.isRange,

		"method": function (condition, value) {

			var range = X.utils.getRangeObject(condition);
			return X.utils.within(range.start, range.end, value);

		}
	});

});
