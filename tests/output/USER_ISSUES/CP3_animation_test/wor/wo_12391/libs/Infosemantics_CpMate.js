!function(){if(!window.unitTests){window.X={version:"0.0.2",build:"1801"};var u={},t=[];X.registerModule=function(e,t,n){var a,i,r,o=!0;function s(e){return u[e]={subordinates:{},instantiated:!1},u[e]}function l(e,t){u[e].subordinates[t]=u[t],o=!1}if("function"==typeof t?(n=t,t=[]):"string"==typeof t&&(t=[t]),u[e]){if(void 0!==u[e].dependencies)throw Error("Tried to register two modules under the name: "+e)}else s(e);(a=u[e]).dependencies=t,a.moduleConstructor=n;for(var c=0;c<a.dependencies.length;c+=1){if(i=a.dependencies[c],r=u[i],i===e)throw new Error("Can't set up a module as a dependency of itself");r?r.instantiated||l(i,e):(r=s(i),l(i,e))}o&&d(e)},window.addEventListener("load",function(){!function(){for(var e=0;e<t.length;e+=1)d(t[e]);t=[]}(),function(){var e;for(var t in u)if(u.hasOwnProperty(t)&&(e=u[t]).onLoadCallback)try{e.onLoadCallback()}catch(e){console.error("Encountered error at module: "+t+"<br/>Details: <br/>"+e)}}()})}function d(e){var t,n,a=u[e];for(var i in a.onLoadCallback=a.moduleConstructor(),a.instantiated=!0,a.subordinates)if(a.subordinates.hasOwnProperty(i)){if((t=u[i]).instantiated)continue;n=!0;for(var r=0;r<t.dependencies.length;r+=1)if(!u[t.dependencies[r]].instantiated){n=!1;break}n&&d(i)}}}(),X.registerModule("elements/animate",function(){"use strict";var t,n=[];function a(){return window.stage}function i(){if(a()){window.clearInterval(t);for(var e=0;e<n.length;e+=1)n[e]();n=t=null}}X.animate={callWhenLoaded:function(e){a()?t?(n.push(e),i()):e():(n.push(e),t||(t=window.setInterval(i,10)))}},X.animate.callWhenLoaded(function(){X.animate.stage=stage,X.animate.mainTimeline=stage.children[0],window.AdobeAn&&(X.animate.library=AdobeAn.getComposition(AdobeAn.bootcompsLoaded[0]).getLibrary())})}),X.registerModule("elements/captivate",["managers/debugging/logging"],function(){var e="1.4.2";X.captivate={isLoaded:function(){return window.parent&&window.parent.hasOwnProperty("cp")},hasCpExtra:function(){return!!X.captivate.window&&X.captivate.window.hasOwnProperty("_extra")},window:null,base:null,extra:null,variables:null},X.captivate.isLoaded()&&(X.captivate.window=window.parent,X.captivate.base=X.captivate.window.cp,X.captivate.alert=X.captivate.window.alert,X.captivate.variables=X.captivate.window,X.captivate.hasCpExtra()?(X.captivate.extra={},X.captivate.extra=X.captivate.window._extra,X.captivate.extraPublicInterface=X.captivate.window.X,X.captivate.extraVersion=X.captivate.extraPublicInterface.version,X.captivate.extraCallActionOn=X.captivate.extraPublicInterface.callActionOn,X.captivate.extraVersion<e&&X.error("GE002",X.captivate.extraVersion,e)):X.error("GE001"))}),X.registerModule("elements/slideObject",["elements/captivate","managers/broadcast"],function(){X.captivate.isLoaded()&&(X.slideObject={},X.slideObject.iframe=window.frameElement,X.slideObject.div=function(e,t,n){for(;e.parentElement;){if(e.getAttribute(t)===n)return e;e=e.parentElement}return null}(X.slideObject.iframe,"class","cp-WebObject"),X.slideObject.name=X.slideObject.div.getAttribute("id"),X.slideObject.name=X.slideObject.name.substring(0,X.slideObject.name.length-1),X.captivate.extra&&(X.slideObject.proxy=X.captivate.extra.slideObjects.getSlideObjectByName(X.slideObject.name))),X.broadcast.addCallback("unload",function(){X.slideObject&&delete X.slideObject.proxy})}),X.registerModule("classes/Callback",["managers/classes"],function(){"use strict";X.classes.register("Callback",function(){this.data={};var s=this;function a(e){s.data[e]||(s.data[e]={overwritable:null,regular:[]})}this.addCallback=function(e,t,n){a(e),n?s.data[e].overwritable=t:s.data[e].regular.push(t)},s.addCallbackToFront=function(e,t){a(e),s.data[e].regular.unshift(t)},this.hasCallbackFor=function(e){return void 0!==s.data[e]},this.sendToCallback=function(e,t){var n,a,i=s.data[e];if(i){i.overwritable&&i.overwritable(t);for(var r=i.regular,o=0;o<r.length;o+=1)void 0!==(a=r[o](t))&&(n=a)}return n},this.forEach=function(e){var t;for(var n in s.data)if(s.data.hasOwnProperty(n)){s.data[n].overwritable&&e(n,s.data[n].overwritable),t=s.data[n].regular;for(var a=0;a<t.length;a+=1)e(n,t[a])}},this.removeCallback=function(e,t){var n=s.data[e];if(n){if(n.overwritable&&n.overwritable===t)return void delete n.overwritable;for(var a=n.regular,i=0;i<a.length;i+=1)if(t===a[i]){a.splice(i,1),a.length<=0&&delete s.data[e];break}}},this.removeIndex=function(e){delete s.data[e]},this.clear=function(){s.data={}}})},"class"),X.registerModule("classes/CallbackObject",["managers/classes"],function(){"use strict";X.classes.register("CallbackObject",function(){var n=new(window.X?X.classes.Callback:unitTests.classes.Callback),a={};this.callback=n.addCallback,this.setProp=function(e,t){a[e]=t,n.sendToCallback(e,t),n.sendToCallback("*",t)},this.getProp=function(e){return a[e]},this.hasProp=function(e){return a.hasOwnProperty(e)},this.removeCallback=n.removeCallback})},"class"),X.registerModule("classes/DisplayObjectProxy",["managers/classes"],function(){function t(e){return"x"===e?e="y":"y"===e?e="x":"width"===e?e="height":"height"===e&&(e="width"),e}function e(e){this.original=e,this.bounds=e.getBounds(),this.switchBoundsProps=90===e.rotation||-90===e.rotation}e.prototype={getBoundsProp:function(e){return this.switchBoundsProps&&(e=t(e)),this.bounds[e]},get x(){return this.original.x+this.getBoundsProp("x")},set x(e){this.original.x=e-this.getBoundsProp("x")},get y(){return this.original.y+this.getBoundsProp("y")},set y(e){this.original.y=e-this.getBoundsProp("y")},get width(){return this.getBoundsProp("width")},get height(){return this.getBoundsProp("height")},get rotation(){return this.original.rotation},get primary(){return this._pa},set primary(e){this._pa=e,this._pl="x"===e?"width":"height",this._sl=t(this._pl),this._sa=t(this._pa)},get primaryAxis(){return this[this._pa]},set primaryAxis(e){this[this._pa]=e},get primaryLength(){return this[this._pl]},get secondaryAxis(){return this[this._sa]},set secondaryAxis(e){this[this._sa]=e},get secondaryLength(){return this[this._sl]}},X.classes.register("DisplayObjectProxy",e)},"class"),X.registerModule("classes/MovieClipProxy",["managers/classes"],function(){function e(e){this._original=e}X.classes.register("MovieClipProxy",e),e.prototype={get labels(){return this._original.timeline._labels},hasLabel:function(e){return this.labels.hasOwnProperty(e)},getLabelFrame:function(e){return this.labels[e]},gotoAndStop:function(e){this._original.gotoAndStop(e)}}},"class"),X.registerModule("managers/broadcast",["classes/Callback"],function(){"use strict";X.broadcast=new X.classes.Callback}),X.registerModule("managers/classes",function(){"use strict";X.classes={register:function(e,t){X.classes.hasOwnProperty(e)?console.log("Already registered a class by the name of: "+e):X.classes[e]=t}}}),X.registerModule("managers/cpExtraActions",["elements/captivate","elements/slideObject"],function(){"use strict";var n={};function e(e){e.action&&e.parameters?n.hasOwnProperty(e.action)?n[e.action].apply(null,e.parameters):X.error("Tried to enact CpMate action '"+e.action+"'. However, no such action was defined in CpMate."):X.error("When broadcasting an action to CpMate an action or parameter was not defined")}X.cpExtraActions={register:function(e,t){n[e]=t},unload:function(){X.captivate.extra.cpMate.deregister(X.slideObject.name,e),X.captivate.extra.cpMate.deregister("*",e)}},X.captivate&&X.captivate.extra&&(X.captivate.extra.cpMate.register(X.slideObject.name,e),X.captivate.extra.cpMate.register("*",e))}),X.registerModule("managers/cpVariablesManager",["managers/utils","managers/hook","elements/captivate","managers/cpExtraActions"],function(){var e=X.captivate.hasCpExtra(),t=new X.classes.CallbackObject;X.cpVariablesManager={listenForVariableChange:e?X.captivate.extra.variableManager.listenForVariableChange:t.callback,setVariableValue:e?X.captivate.extra.variableManager.setVariableValue:t.setProp,getVariableValue:e?X.captivate.extra.variableManager.getVariableValue:t.getProp,hasVariable:e?X.captivate.extra.variableManager.getVariableValue:t.hasProp,stopListeningForVariableChange:e?X.captivate.extra.variableManager.stopListeningForVariableChange:t.removeCallback};var n={};X.addHook(X.cpVariablesManager,"listenForVariableChange",function(e,t){n[e]=t}),X.cpExtraActions.register("unload",function(){X.utils.forEach(n,function(e,t){X.cpVariablesManager.stopListeningForVariableChange(e,t)})})}),X.registerModule("managers/dispatchLoadedEvent",function(){"use strict";return function(){var e,t;window.dispatchEvent((e="cpmateLoaded","function"==typeof Event?t=new Event(e):(t=document.createEvent("Event")).initEvent(e,!0,!0),t))}}),X.registerModule("managers/hook",function(){"use strict";var r=[];function a(e,t,n){var a={location:e,methodName:t,hookMethod:n,originalMethod:e[t]};return a.location[a.methodName]=function(){var e,t=arguments;if(a.callHookBeforeOriginal){if(e=a.hookMethod.apply(this,arguments),"[object Arguments]"===Object.prototype.toString.call(e))t=e;else if(void 0!==e)return e;return a.originalMethod.apply(this,t)}return e=a.originalMethod.apply(this,t),a.hookMethod.apply(this,arguments),e},r.push(a),a}function i(e){var t=r[e];t&&(r.splice(e,1),t.location[t.methodName]=t.originalMethod)}function o(e,t,n){for(var a,i=0;i<r.length;i+=1)if((a=r[i]).location===e&&a.methodName===t&&(!n||a.hookMethod===n))return i;return-1}X.addHookAfter=function(e,t,n){a(e,t,n).callHookBeforeOriginal=!1},X.addHookBefore=function(e,t,n){a(e,t,n).callHookBeforeOriginal=!0},X.addHook=X.addHookAfter,X.hasHook=function(e,t){return-1<o(e,t)},X.removeHook=function(e,t,n){var a=o(e,t,n);return-1<a&&(i(a),!0)},X.addOneTimeHook=function(e,t,n){var a=function(){n.apply(this,arguments),X.removeHook(e,t,a)};X.addHookAfter(e,t,a)}}),X.registerModule("managers/mouseEvents",["managers/utils","elements/slideObject"],function(){"use strict";var t={mousemove:"touchmove",mousedown:"touchstart",mouseup:"touchend"};X.events={getSafeEvent:function(e){return X.utils.isMobile&&t.hasOwnProperty(e)?t[e]:e}};var a=[];X.slideObject&&X.slideObject.proxy&&(["click","doubleclick","contextmenu","mouseover","mouseout","mousemove","mousedown","mouseup"].forEach(function(e){!function(e){var t=X.events.getSafeEvent(e);function n(){X.slideObject.proxy.dispatchEvent(t)}a.push({eventName:t,handler:n}),document.addEventListener(t,n)}(e)}),X.broadcast.addCallback("unload",function(){a.forEach(function(e){document.removeEventListener(e.eventName,e.handler)}),a=null}))}),X.registerModule("managers/movie",["elements/animate","managers/hook"],function(){var e,t,n={isMock:!0,play:function(){e=!0},stop:function(){e=!1},gotoAndPlay:function(e){t=e},enact:function(){void 0!==e&&(e?X.movie.play():X.movie.stop()),void 0!==t&&X.movie.gotoAndPlay(t)}};X.movie={changeCallback:new X.classes.Callback,play:function(){n.play(),X.movie.changeCallback.sendToCallback("play")},stop:function(e){n.stop(e),X.movie.changeCallback.sendToCallback("stop",e)},gotoAndPlay:function(e){n.gotoAndPlay(e),n.play()},isPaused:function(){return n.paused},getLabels:function(){return n.labels?n.labels:[]},_setRootTimeline:function(e){var t=n;n=e,t.isMock&&t.enact(),X.movie.pause.setRootTimeline(e)}},X.animate.callWhenLoaded(function(){n.isMock&&X.movie.rootTimeline&&X.movie.rootTimeline.set(X.animate.mainTimeline)})}),X.registerModule("managers/preferences",function(){function a(){}return X.preferences={define:function(t){var n,e=function(e){n!==e&&(n=e,t.animateRequired?X.animate.callWhenLoaded(function(){t.method(n)}):t.method(n))};Object.defineProperty(a.prototype,t.name,{get:function(){return n},set:e}),t.default&&e(t.default)}},function(){X.preferences=new a}}),X.registerModule("managers/runInCaptivateWindow",["elements/captivate"],function(){"use strict";X.runInCaptivateWindow=function(e,t){if(X.captivate.extra){var n="("+e.toString()+"())";n&&X.captivate.extra.safeEval(n,t)}}}),X.registerModule("managers/utils",function(){"use strict";X.utils={isMobile:"ontouchstart"in document.documentElement,callIfDefined:function(e){if(e){var t=Array.prototype.slice.call(arguments);return t=t.splice(1,t.length),e.apply(null,t)}},onNextTick:function(t){return function(){var e=arguments;createjs&&createjs.Ticker&&createjs.Ticker.on("tick",function(){t.apply(null,e)},null,!0)}},singleton:function(e){var t=!1;return function(){t||(e.apply(null,arguments),t=!0)}},hasSuffix:function(e,t){return e.substring(e.length-t.length,e.length)===t},callByType:function(e,t){switch(typeof e){case"string":return X.utils.callIfDefined(t.string,e);case"number":return X.utils.callIfDefined(t.number,e);case"object":return e.constructor===Array?X.utils.callIfDefined(t.array,e):X.utils.callIfDefined(t.object,e)}},isEmpty:function(e){return X.utils.callByType(e,{object:function(e){return Object.keys(e).length<=0},array:function(e){return e.length<=0}})},filter:function(e,i){var t={array:function(e){var t=[];return e.forEach(function(e){i(e)&&t.push(e)}),t},object:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&i(n,e[n])&&(t[n]=e[n]);return t},string:function(e){for(var t,n="",a=0;a<e.length;a+=1)t=e[a],i(t)&&(n+=t);return n}};return X.utils.callByType(e,t)},forEach:function(e,n){X.utils.callByType(e,{array:function(e){e.forEach(n)},object:function(e){for(var t in e)e.hasOwnProperty(t)&&n(t,e[t])}})},forEachUntil:function(e,t,n){for(var a=0;a<n.length;a+=1){var i=t(n[a]);if(e(i))return i}},forEachUntilResult:function(e,t){return X.utils.forEachUntil(function(e){return void 0!==e},e,t)},defaultTo:function(e,a){return X.utils.forEach(e,function(e,t){if(null!==t&&"object"==typeof t){var n=a[e];n||(n={}),a[e]=X.utils.defaultTo(t,n)}else a.hasOwnProperty(e)||(a[e]=t)}),a},getMissingProps:function(e,t){var n=[];return X.utils.forEach(e,function(e){t.hasOwnProperty(e)||n.push(e)}),n},ifElse:function(e,t,n){return function(){return e.apply(null,arguments)?t.apply(null,arguments):n.apply(null,arguments)}},when:function(e,t){return X.utils.ifElse(e,t,function(){})},unless:function(e,t){return X.utils.ifElse(e,function(){},t)},getPercent:function(e,t,n){return(n-e)/(t-e)},minMax:function(e,t,n){return n=Math.min(n,t),n=Math.max(n,e)},calculatePercentInRange:function(e,t,n){return(t-e)*n+e},reduce:function(t,n,e){return X.utils.forEach(e,function(e){n=t(e,n)}),n},both:function(t,n){return function(e){return t(e)&&n(e)}},either:function(t,n){return function(e){return t(e)||n(e)}}}}),X.registerModule("preferences/disableIFrameBorder",["managers/preferences","elements/slideObject"],function(){X.preferences.define({name:"disableIFrameBorder",method:function(e){X.captivate.isLoaded()&&(X.slideObject.div.style.border=e?"0px":"1px")},default:!1})}),X.registerModule("preferences/linkNameToLibrarySymbol",["managers/preferences","elements/slideObject","managers/movie","elements/animate"],function(){function n(){var e=X.slideObject.name;if(X.animate.library[e])return e;var t=e.lastIndexOf("_");return 0<t&&(e=e.substring(0,t)),!!X.animate.library[e]&&e}X.preferences.define({name:"linkNameToLibrarySymbol",animateRequired:!0,method:function(e){if(e&&X.slideObject){var t=n();t?X.movie.rootTimeline.set(t):X.log("Could not find a symbol by the name of '"+n()+"'. Perhaps this animation is only included to preload other animations?")}},default:!1})}),X.registerModule("preferences/pausingInstanceSuffix",["managers/preferences","managers/utils"],function(){"use strict";var n,a=X.utils.singleton(function(){X.movie.changeCallback.addCallback("play",function(){X.utils.forEach(n,function(e,t){t.play()})}),X.movie.changeCallback.addCallback("stop",function(){X.utils.forEach(n,function(e,t){t.stop()})})});X.preferences.define({name:"pausingInstanceSuffix",animateRequired:!0,method:function(e){function t(){n=X.movie.children.getListMatchingSuffix(e)}a(),X.movie.children.exist&&t(),X.movie.children.changeCallback.addCallback("*",t)}})}),X.registerModule("managers/preferences/preview",["managers/preferences"],function(){"use strict";X.preferences.define({name:"preview",animateRequired:!0,method:function(e){X.captivate.isLoaded()||(X.movie.rootTimeline.set(e),document.addEventListener("click",X.movie.play))}})}),X.registerModule("useRAFTiming",["managers/preferences"],function(){"use strict";X.preferences.define({name:"useRAFTiming",animateRequired:!0,method:function(e){createjs&&createjs.Ticker?createjs.Ticker.timingMode=e?createjs.Ticker.RAF_SYNCHED:null:console.error("Tried to change createjs.Ticker timing mode before it was loaded")},default:!0})}),X.registerModule("managers/actions/exitslide",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions.register("exitslide",function(){})}),X.registerModule("managers/actions/gotoFrameLabel",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions&&X.cpExtraActions.register("gotoFrameLabel",function(e){X.animate.callWhenLoaded(function(){!function(e){var t,n=X.movie.getLabels();e=e.toString();for(var a=0;a<n.length;a+=1)if((t=n[a]).label===e)return X.movie.gotoAndPlay(t.position)}(e)})})}),X.registerModule("managers/actions/playAndStop",["managers/cpExtraActions"],function(){"use strict";function e(e,t){X.cpExtraActions.register(e,function(){X.animate.callWhenLoaded(function(){t()})})}X.cpExtraActions&&(e("movieResume",function(){X.movie.isPaused()&&X.movie.pause.reason===X.movie.pause.type.CAPTIVATE_PAUSED&&X.movie.play()}),e("moviePause",function(){X.movie.isPaused()||X.movie.stop(X.movie.pause.type.CAPTIVATE_PAUSED)}))}),X.registerModule("managers/actions/unload",["managers/cpExtraActions"],function(){"use strict";function e(){window.removeEventListener("unload",e),X.cpExtraActions.unload(),X.broadcast.sendToCallback("unload")}X.cpExtraActions.register("unload",e),window.addEventListener("unload",e)}),X.registerModule("managers/debugging/errors",function(){X.errors={GE001:function(){return"You have not loaded CpExtra into Captivate. CpMate cannot work if CpExtra is not installed in Captivate. Either install CpExtra or remove CpMate."},GE002:function(e,t){return"CPEXTRA NEEDS TO BE UPGRADED. The current version of CpExtra is "+e+". But the minimum version of CpExtra needed to work with CpMate is "+t+". PLEASE UPGRADE CPEXTRA NOW."},CO001:function(e){return"The required property for slider/dial data ''"+e+"'' was not provided"},CO002:function(e){return"The variable defined for the slider/dial interaction '"+e+"' does not exist'"},CO003:function(e){return"The evaluate settings for a slider/dial interaction did not have the required '"+e+"' property defined."},PR001:function(e){return"Could not find a matching variable for movie clip named: '"+e+"'"}}}),X.registerModule("managers/debugging/logging",["managers/debugging/errors"],function(){X.log=function(e){console.log(e)},X.alert=function(e,t){X.captivate.isLoaded()?X.captivate.alert(e,t):alert(e)},X.error=function(e,t){var n="CpMate Error";if(X.errors.hasOwnProperty(e)){var a=Array.prototype.slice.call(arguments);a.splice(0,1),t=X.errors[e].apply(this,a),n+=": "+e}else t=e;X.alert(t,n)}}),X.registerModule("managers/movie/children",["managers/movie/rootTimeline","managers/utils"],function(){"use strict";X.movie.children={list:{},changeCallback:new X.classes.Callback,exist:!1,getListMatchingSuffix:function(n){return X.utils.filter(X.movie.children.list,function(e,t){return X.utils.hasSuffix(e,n)})}},X.movie.rootTimeline.changeCallback.addCallback("*",X.utils.onNextTick(function(e){X.movie.children.list=function(e){var t={};function n(e){e.name&&!t.hasOwnProperty(e.name)&&(t[e.name]=e)}return e.children&&function t(e){n(e),e.children.forEach(function(e){e.children&&0<e.children.length?t(e):n(e)})}(e),t}(e),X.movie.children.exist=!X.utils.isEmpty(X.movie.children.list),X.movie.children.changeCallback.sendToCallback("*")}))}),X.registerModule("managers/movie/pause",["managers/movie"],function(){"use strict";var t;function n(e){e||(e=X.movie.pause.type.FRAME_SCRIPT),X.movie.pause.reason=e}X.movie.pause={type:{FRAME_SCRIPT:"frame_script",CAPTIVATE_PAUSED:"captivate_paused"},setRootTimeline:function(e){t&&X.removeHook(t,"stop",n),t=e,X.addHook(t,"stop",n)},reason:null}}),X.registerModule("managers/movie/rootTimeline",["managers/movie","classes/Callback"],function(){"use strict";X.movie.rootTimeline={changeCallback:new X.classes.Callback,set:function(e){if(X.animate&&X.animate.library)if("string"==typeof e)if(X.animate.library.hasOwnProperty(e)){var t=new X.animate.library[e];X.animate.mainTimeline.addChild(t),n(t)}else X.error("Could not find symbol with name "+e+" in library. Therefore was unable to add it as root timeline.");else n(e);else console.log("Tried to set root timeline before animate loaded");function n(e){X.movie._setRootTimeline(e),X.movie.rootTimeline.changeCallback.sendToCallback("*",e)}}}}),X.registerModule("managers/prefix/displayObjectName",["managers/movie/children","managers/utils"],function(){var a={},i={};X.registerDisplayObjectNamePrefix=function(e,t){a[e]=t,a[e.toLowerCase()]=t},X.movie.children.changeCallback.addCallback("*",function(){X.utils.forEach(X.movie.children.list,function(e,t){if(i[e]!==t){var n=e.split("_")[0];a.hasOwnProperty(n)&&(i[e]=t,a[n](t))}})})}),X.registerModule("managers/prefix/displayObjectNameAndVariable",["managers/prefix/displayObjectName"],function(){function i(e){var t=e.split("_"),n=t.splice(1,t.length-1);!function(e){if(!X.captivate.hasCpExtra()){var t=r(e);X.cpVariablesManager.setVariableValue(t,"")}}(n);var a=function(e){var t,n,a,i=e.length-1;for(;0<=i;){if(t=e.concat(),n=t.splice(0,i+1),a=r(n),X.cpVariablesManager.hasVariable(a))return a;i--}return null}(n);if(a)return a;X.error("PR001",e)}function r(e){var t=X.utils.reduce(n,"",e);return t.substring(1,t.length)}function n(e,t){return t+"_"+e}X.registerDisplayObjectNamePrefixAndVariable=function(e,a){X.registerDisplayObjectNamePrefix(e,function(t){function e(e){a(t,e)}var n=i(t.name);n&&(X.cpVariablesManager.listenForVariableChange(n,e),e(X.cpVariablesManager.getVariableValue(n)))})}}),X.registerModule("managers/components/slider/controller",["managers/utils","managers/components/slider/validator"],function(){X.slider.controller=function(e,n,t){var a;function i(){return X.animate.stage.mouseX}function r(){return X.animate.stage.mouseY}return e.listenToTrack(X.events.getSafeEvent("mousedown"),function(){}),e.listenToHandle(X.events.getSafeEvent("mousedown"),function(){function t(){n.dragMove(i(),r()),a.dragMove()}n.dragStart(i(),r()),document.addEventListener(X.events.getSafeEvent("mousemove"),t),document.addEventListener(X.events.getSafeEvent("mouseup"),function e(){n.dragEnd(),a.dragEnd(),document.removeEventListener(X.events.getSafeEvent("mousemove"),t),document.removeEventListener(X.events.getSafeEvent("mouseup"),e)})}),a=t.evaluate?X.slider.evaluate(t.evaluate,t.variable):{dragMove:function(){},dragEnd:function(){}},{}}}),X.registerModule("managers/components/slider/evaluate",["managers/mouseEvents","managers/utils","managers/components/slider/validator"],function(){X.slider.evaluate=function(t,e){var i,r=[],n=function(e){return function(){return!!t.on&&t.on.toLowerCase()===e}},a=n("continually"),o=n("mouseup"),s=n("button"),l=X.utils.either(a,o);function c(e){switch(typeof e){case"function":e();break;case"string":X.captivate.hasCpExtra()&&X.captivate.extraCallActionOn(e)}}function u(){var t=X.cpVariablesManager.getVariableValue(e),n=!1;X.utils.forEach(r,function(e){e(t)&&(n=!0)}),!n&&i&&c(i)}return X.utils.when(function(){return t.on?!!t.criteria||(X.error("CO003","criteria"),!1):(X.error("CO003","on"),!1)},function(){X.utils.forEach(t.criteria,function(t){if("default"!==t.if){var n,a=(n=t.if,X.utils.forEachUntilResult(function(t){if(t.isValid(n))return function(e){return t.method(n,e)}},X.slider.evaluateMethods));a&&r.push(function(e){return!!a(e)&&(c(t.then),!0)})}else i=t.then}),s()&&t.button&&t.button.addEventListener(X.events.getSafeEvent("click"),u)})(),{dragMove:X.utils.when(a,u),dragEnd:X.utils.when(l,u)}}}),X.registerModule("managers/components/slider/model",["managers/utils","managers/components/slider/validator"],function(){X.slider.model=function(l){var t,i=l.variable,n=!1,c="vertical"===l.orientation,u=0,d={handlePosition:0},a=new X.classes.DisplayObjectProxy(l.handle),e=new X.classes.DisplayObjectProxy(l.track);e.primary=c?a.primary="y":a.primary="x";var f=e.primaryAxis+e.primaryLength-a.primaryLength,p=e.primaryAxis;function r(e){return function(){e.apply(null,arguments),t(d)}}var o=X.utils.unless(function(){return n},r(function(){var e,t,n,a=X.cpVariablesManager.getVariableValue(i);d.handlePosition=(e=a,t=X.utils.getPercent(l.min,l.max,e),n=X.utils.minMax(0,1,t),X.utils.calculatePercentInRange(p,f,n))}));return X.captivate.hasCpExtra()||X.cpVariablesManager.setVariableValue(i,l.min),(X.cpVariablesManager.hasVariable(i)||(X.error("CO002",i),0))&&X.cpVariablesManager.listenForVariableChange(i,o),{updateTo:function(e){t=e},dragStart:function(e,t){n=!0,u=c?t-a.y:e-a.x},dragMove:r(function(e,t){var n,a,i,r,o,s=(n=c?t:e,n-=u,n=Math.min(n,f),n=Math.max(n,p));a=s,i=X.utils.getPercent(p,f,a),r=X.utils.calculatePercentInRange(l.min,l.max,i),o=Math.round(r),X.cpVariablesManager.setVariableValue(l.variable,o),d.handlePosition=s}),dragEnd:function(){n=!1}}}}),X.registerModule("managers/components/slider/registerEvaluateMethod",["managers/components/slider/validator"],function(){X.slider.evaluateMethods=[],X.slider.registerEvaluateMethod=X.slider.evaluateMethods.push}),X.registerModule("managers/components/slider/validator",["managers/utils"],function(){X.slider=function(r){!function(){if(i=X.utils.getMissingProps(["variable","handle","track"],r),!(0<i.length)||(X.utils.forEach(i,function(e){X.error("CE001",e)}),0)){var e,t,n,a=X.utils.defaultTo({min:0,max:100,reverse:!1,orientation:"vertical",hideTrack:!1,scrollUp:null,scrollDown:null,attachedItems:null,trackClicking:!1,throwingFriction:0,handCursor:!0,scrollWhenOver:!1,scroll:!1,scrollStep:10},r);e=a,t=X.slider.model(e),n=X.slider.view(e),X.slider.controller(n,t,e),t.updateTo(n.update)}var i}()}}),X.registerModule("managers/components/slider/view",["managers/utils","managers/components/slider/validator"],function(){X.slider.view=function(n){var e=n.handle,t=n.track,a=new X.classes.DisplayObjectProxy(e),i=new X.classes.DisplayObjectProxy(t),r="v"===("vertical"===n.orientation?"v":"h")?"y":"x";return a.primary=r,i.primary=r,a.primaryAxis=i.primaryAxis,a.secondaryAxis=i.secondaryAxis+(i.secondaryLength-a.secondaryLength)/2,{track:n.track,handle:n.handle,listenToTrack:function(e,t){n.track.addEventListener(e,t)},listenToHandle:function(e,t){n.handle.addEventListener(e,t)},update:function(e){a.primaryAxis=e.handlePosition}}}}),X.registerModule("managers/prefixes/registees/xBind",["managers/prefix/displayObjectNameAndVariable"],function(){X.registerDisplayObjectNamePrefixAndVariable("xBind",function(e,t){var n=new X.classes.MovieClipProxy(e);if(n.hasLabel(t)){var a=n.getLabelFrame(t);n.gotoAndStop(a)}else n.gotoAndStop(0)})});