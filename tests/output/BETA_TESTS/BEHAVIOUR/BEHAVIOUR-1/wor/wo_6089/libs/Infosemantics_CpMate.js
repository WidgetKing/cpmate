!function(){if(!window.unitTests){window.X={version:"0.0.2",build:"3040"};var u={},t=[];X.registerModule=function(e,t,n){var a,i,r,o=!0;function s(e){return u[e]={subordinates:{},instantiated:!1},u[e]}function l(e,t){u[e].subordinates[t]=u[t],o=!1}if("function"==typeof t?(n=t,t=[]):"string"==typeof t&&(t=[t]),u[e]){if(void 0!==u[e].dependencies)throw Error("Tried to register two modules under the name: "+e)}else s(e);(a=u[e]).dependencies=t,a.moduleConstructor=n;for(var c=0;c<a.dependencies.length;c+=1){if(i=a.dependencies[c],r=u[i],i===e)throw new Error("Can't set up a module as a dependency of itself");r?r.instantiated||l(i,e):(r=s(i),l(i,e))}o&&d(e)},window.addEventListener("load",function(){!function(){for(var e=0;e<t.length;e+=1)d(t[e]);t=[]}(),function(){var e;for(var t in u)if(u.hasOwnProperty(t)&&(e=u[t]).onLoadCallback)try{e.onLoadCallback()}catch(e){console.error("Encountered error at module: "+t+"<br/>Details: <br/>"+e)}}()})}function d(e){var t,n,a=u[e];for(var i in a.onLoadCallback=a.moduleConstructor(),a.instantiated=!0,a.subordinates)if(a.subordinates.hasOwnProperty(i)){if((t=u[i]).instantiated)continue;n=!0;for(var r=0;r<t.dependencies.length;r+=1)if(!u[t.dependencies[r]].instantiated){n=!1;break}n&&d(i)}}}(),X.registerModule("classes/Callback",["managers/classes"],function(){"use strict";X.classes.register("Callback",function(){this.data={};var s=this;function a(e){s.data[e]||(s.data[e]={overwritable:null,regular:[]})}this.addCallback=function(e,t,n){a(e),n?s.data[e].overwritable=t:s.data[e].regular.push(t)},s.addCallbackToFront=function(e,t){a(e),s.data[e].regular.unshift(t)},this.hasCallbackFor=function(e){return void 0!==s.data[e]},this.sendToCallback=function(e,t){var n,a,i=s.data[e];if(i){i.overwritable&&i.overwritable(t);for(var r=i.regular,o=0;o<r.length;o+=1)void 0!==(a=r[o](t))&&(n=a)}return n},this.forEach=function(e){var t;for(var n in s.data)if(s.data.hasOwnProperty(n)){s.data[n].overwritable&&e(n,s.data[n].overwritable),t=s.data[n].regular;for(var a=0;a<t.length;a+=1)e(n,t[a])}},this.removeCallback=function(e,t){var n=s.data[e];if(n){if(n.overwritable&&n.overwritable===t)return void delete n.overwritable;for(var a=n.regular,i=0;i<a.length;i+=1)if(t===a[i]){a.splice(i,1),a.length<=0&&delete s.data[e];break}}},this.removeIndex=function(e){delete s.data[e]},this.clear=function(){s.data={}}})},"class"),X.registerModule("classes/CallbackObject",["managers/classes"],function(){"use strict";X.classes.register("CallbackObject",function(){var n=new(window.X?X.classes.Callback:unitTests.classes.Callback),a={};this.callback=n.addCallback,this.setProp=function(e,t){a[e]=t,n.sendToCallback(e,t),n.sendToCallback("*",t)},this.getProp=function(e){return a[e]},this.hasProp=function(e){return a.hasOwnProperty(e)},this.removeCallback=n.removeCallback})},"class"),X.registerModule("classes/DisplayObjectProxy",["managers/classes"],function(){function t(e){return"x"===e?e="y":"y"===e?e="x":"width"===e?e="height":"height"===e&&(e="width"),e}function e(e){this.original=e,this.switchBoundsProps=90===e.rotation||-90===e.rotation}e.prototype={getBoundsProp:function(e){return this.switchBoundsProps&&(e=t(e)),this.bounds[e]},get bounds(){var e=this.original.getBounds();return e||(e={x:this.original.x,y:this.original.y,width:0,height:0}),e},get x(){return this.original.x+this.getBoundsProp("x")},set x(e){this.original.x=e-this.getBoundsProp("x")},get y(){return this.original.y+this.getBoundsProp("y")},set y(e){this.original.y=e-this.getBoundsProp("y")},get width(){return this.getBoundsProp("width")},get height(){return this.getBoundsProp("height")},get rotation(){return this.original.rotation},get primary(){return this._pa},set primary(e){this._pa=e,this._pl="x"===e?"width":"height",this._sl=t(this._pl),this._sa=t(this._pa)},get primaryAxis(){return this[this._pa]},set primaryAxis(e){this[this._pa]=e},get primaryLength(){return this[this._pl]},get secondaryAxis(){return this[this._sa]},set secondaryAxis(e){this[this._sa]=e},get secondaryLength(){return this[this._sl]}},X.classes.register("DisplayObjectProxy",e)},"class"),X.registerModule("classes/MovieClipProxy",["managers/classes"],function(){function e(e){this._original=e}X.classes.register("MovieClipProxy",e),e.prototype={get labels(){return this._original.timeline._labels},hasLabel:function(e){return this.labels.hasOwnProperty(e)},getLabelFrame:function(e){return this.labels[e]},gotoAndStop:function(e){this._original.gotoAndStop(e)},gotoAndPlay:function(e){this._original.gotoAndPlay(e)},stop:function(){this._original.stop()},callOnNextTick:function(t){var n=this;this._original.addEventListener("tick",function e(){n._original.removeEventListener("tick",e),t()})}}},"class"),X.registerModule("classes/TextFieldProxy",["managers/classes"],function(){function e(e){this._original=e}X.classes.register("TextFieldProxy",e),e.prototype={get text(){return this._original.text},set text(e){this._original.text=e},get valid(){return this._original.constructor===createjs.Text}}},"class"),X.registerModule("elements/animate",["managers/loadQueue","managers/hook"],function(){"use strict";var t=[];X.loadQueue.callback.addCallback("complete",function(){t.forEach(function(e){e()}),t=null}),X.animate={callWhenLoaded:function(e){window.stage?e():t.push(e)}},X.animate.callWhenLoaded(function(){X.animate.stage=stage,createjs.Touch.enable(X.animate.stage,!0),X.animate.mainTimeline=stage.children[0],window.AdobeAn&&(X.animate.library=AdobeAn.getComposition(AdobeAn.bootcompsLoaded[0]).getLibrary())}),X.loadQueue.callback.addCallback("readytoplay",function(){X.captivate?X.captivate.extra&&X.captivate.extra.cpMate.notifyCpExtra&&X.captivate.extra.cpMate.notifyCpExtra(X.slideObject.name,"animationready"):console.log("WARNING: Tried to send 'animationready' notification to CpExtra, but the 'elements/captivate' module has not yet run")})}),X.registerModule("elements/captivate",["managers/debugging/logging"],function(){var e="1.4.2";X.captivate={isLoaded:function(){return window.parent&&window.parent.hasOwnProperty("cp")},hasCpExtra:function(){return!!X.captivate.window&&X.captivate.window.hasOwnProperty("_extra")},window:null,base:null,extra:null,variables:null},X.captivate.isLoaded()&&(X.captivate.window=window.parent,X.captivate.base=X.captivate.window.cp,X.captivate.alert=X.captivate.window.alert,X.captivate.variables=X.captivate.window,X.captivate.hasCpExtra()?(X.captivate.extra={},X.captivate.extra=X.captivate.window._extra,X.captivate.extraPublicInterface=X.captivate.window.X,X.captivate.extraVersion=X.captivate.extraPublicInterface.version,X.captivate.extraCallActionOn=X.captivate.extraPublicInterface.callActionOn,X.captivate.extraVersion<e&&X.error("GE002",X.captivate.extraVersion,e)):X.error("GE001"))}),X.registerModule("elements/slideObject",["elements/captivate","managers/broadcast"],function(){X.captivate.isLoaded()&&(X.slideObject={},X.slideObject.iframe=window.frameElement,X.slideObject.div=function(e,t,n){for(;e.parentElement;){if(e.getAttribute(t)===n)return e;e=e.parentElement}return null}(X.slideObject.iframe,"class","cp-WebObject"),X.slideObject.name=X.slideObject.div.getAttribute("id"),X.slideObject.name=X.slideObject.name.substring(0,X.slideObject.name.length-1),X.captivate.extra&&(X.slideObject.proxy=X.captivate.extra.slideObjects.getSlideObjectByName(X.slideObject.name))),X.broadcast.addCallback("unload",function(){X.slideObject&&delete X.slideObject.proxy})}),X.registerModule("managers/broadcast",["classes/Callback"],function(){"use strict";X.broadcast=new X.classes.Callback}),X.registerModule("managers/canvasSize",["preferences/size","elements/animate","managers/utils"],function(){var e,t=!1,n=X.utils.onNextTick(function(){t=!1,e()});X.resizeCanvas=function(){t||(t=!0,n())},X.animate.callWhenLoaded(function(){var f,p,m=[document.getElementById("canvas"),document.getElementById("animation_container"),document.getElementById("dom_overlay_container")],g=1,h=X.animate.library;e=function(e){e&&e.preventDefault();var t,n=X.preferences.stageWidth,a=X.preferences.stageHeight,i=window.innerWidth,r=window.innerHeight,o=window.devicePixelRatio||1,s=i/n,l=r/a,c=1;(X.preferences.makeResponsive&&(X.preferences.responsiveDirection==X.preferences.responsiveDirections.WIDTH&&f==i||X.preferences.responsiveDirection==X.preferences.responsiveDirections.HEIGHT&&p==r?c=g:X.preferences.scaleType==X.preferences.scaleTypes.FIT_IN_VIEW?c=Math.min(s,l):scaleType==X.preferences.scaleTypes.STRETCH_TO_FIT?c=Math.max(s,l):(i<n||r<a)&&(c=Math.min(s,l))),X.preferences.outerRendering)?(c===s?(h.properties.width=n,h.properties.height=r/c):c===l?(h.properties.width=i/c,h.properties.height=a):(h.properties.width=n,h.properties.height=a,console.log("To use X.properties.outerRendering you must also enable Make Responsive under Publish Settings")),X.preferences.linkNameToLibrarySymbol&&((t=X.movie.rootTimeline.get()).y=h.properties.height/2-a/2,t.x=h.properties.width/2-n/2)):(h.properties.width=n,h.properties.height=a,(t=X.movie.rootTimeline.get()).y=0,t.x=0);var u=h.properties.width,d=h.properties.height;m[0].width=u*o*c,m[0].height=d*o*c,m.forEach(function(e){e.style.width=u*c+"px",e.style.height=d*c+"px"}),stage.scaleX=o*c,stage.scaleY=o*c,f=i,p=r,g=c,stage.tickOnUpdate=!1,stage.update(),stage.tickOnUpdate=!0},window.addEventListener("resize",e,!0),e()})}),X.registerModule("managers/classes",function(){"use strict";X.classes={register:function(e,t){X.classes.hasOwnProperty(e)?console.log("Already registered a class by the name of: "+e):X.classes[e]=t}}}),X.registerModule("managers/cpExtraActions",["elements/captivate","elements/slideObject"],function(){"use strict";var n={};function e(e){e.action&&e.parameters?n.hasOwnProperty(e.action)?n[e.action].apply(null,e.parameters):X.error("Tried to enact CpMate action '"+e.action+"'. However, no such action was defined in CpMate."):X.error("When broadcasting an action to CpMate an action or parameter was not defined")}X.cpExtraActions={register:function(e,t){n[e]=t},unload:function(){X.captivate.extra.cpMate.deregister(X.slideObject.name,e),X.captivate.extra.cpMate.deregister("*",e)}},X.captivate&&X.captivate.extra&&(X.captivate.extra.cpMate.register(X.slideObject.name,e),X.captivate.extra.cpMate.register("*",e))}),X.registerModule("managers/cpVariablesManager",["managers/utils","managers/hook","elements/captivate","managers/cpExtraActions"],function(){var e=X.captivate.hasCpExtra(),t=new X.classes.CallbackObject;X.cpVariablesManager={listenForVariableChange:e?X.captivate.extra.variableManager.listenForVariableChange:t.callback,setVariableValue:e?X.captivate.extra.variableManager.setVariableValue:t.setProp,getVariableValue:e?X.captivate.extra.variableManager.getVariableValue:t.getProp,hasVariable:e?X.captivate.extra.variableManager.getVariableValue:t.hasProp,stopListeningForVariableChange:e?X.captivate.extra.variableManager.stopListeningForVariableChange:t.removeCallback};var n={};X.addHook(X.cpVariablesManager,"listenForVariableChange",function(e,t){n[e]||(n[e]=[]),n[e].push(t)}),X.broadcast.addCallback("unload",function(){X.utils.forEach(n,function(t,e){e.forEach(function(e){X.cpVariablesManager.stopListeningForVariableChange(t,e)})}),n={}})}),X.registerModule("managers/events",["managers/mouseEvents"],function(){X.events.newEvent=function(e){if("function"==typeof Event)return new Event(e);var t=document.createEvent("Event");return t.initEvent(e,!0,!0),t}}),X.registerModule("managers/hook",function(){"use strict";var r=[];function a(e,t,n){var a={location:e,methodName:t,hookMethod:n,originalMethod:e[t]};return a.location[a.methodName]=function(){var e,t=arguments;if(a.callHookBeforeOriginal){if(e=a.hookMethod.apply(this,arguments),"[object Arguments]"===Object.prototype.toString.call(e))t=e;else if(void 0!==e)return e;return a.originalMethod.apply(this,t)}return e=a.originalMethod.apply(this,t),a.hookMethod.apply(this,arguments),e},r.push(a),a}function i(e){var t=r[e];t&&(r.splice(e,1),t.location[t.methodName]=t.originalMethod)}function o(e,t,n){for(var a,i=0;i<r.length;i+=1)if((a=r[i]).location===e&&a.methodName===t&&(!n||a.hookMethod===n))return i;return-1}X.addHookAfter=function(e,t,n){a(e,t,n).callHookBeforeOriginal=!1},X.addHookBefore=function(e,t,n){a(e,t,n).callHookBeforeOriginal=!0},X.addHook=X.addHookAfter,X.hasHook=function(e,t){return-1<o(e,t)},X.removeHook=function(e,t,n){var a=o(e,t,n);return-1<a&&(i(a),!0)},X.addOneTimeHook=function(e,t,n){var a=function(){n.apply(this,arguments),X.removeHook(e,t,a)};X.addHookAfter(e,t,a)}}),X.registerModule("managers/loadQueue",["managers/hook","classes/Callback"],function(){X.loadQueue={callback:new X.classes.Callback},X.addOneTimeHook(createjs.MovieClip.prototype,"_updateTimeline",function(){X.loadQueue.callback.sendToCallback("readytoplay",null)}),X.addOneTimeHook(createjs.LoadQueue.prototype,"loadManifest",function(){var t=this;t.on("complete",function(e){X.loadQueue.callback.sendToCallback("complete",t)}),t.on("fileload",function(){X.loadQueue.callback.sendToCallback("fileload",t)}),t.on("error",function(e){X.loadQueue.callback.sendToCallback("error",e),console.error(e.title+"\nFailed to load Animate Sprite Sheet: "+e.data.id)})})}),X.registerModule("managers/manifest",function(){var e=Object.keys(AdobeAn.compositions)[0];AdobeAn.getComposition(e).getLibrary().properties.manifest.forEach(function(e){e.loadTimeout=6e4})}),X.registerModule("managers/mouseEvents",["managers/utils","elements/slideObject","elements/animate"],function(){"use strict";var t={mousemove:"touchmove",mouseup:"touchend"};X.events={getSafeEvent:function(e){return X.utils.isMobile&&t.hasOwnProperty(e)?t[e]:e}};createjs.Touch.enable(X.animate.stage,!0);var a=[];function i(e){X.slideObject&&X.slideObject.proxy&&X.slideObject.proxy.dispatchEvent(e)}X.slideObject&&X.slideObject.proxy&&(["click","doubleclick","contextmenu","mouseover","mouseout","mousemove","mousedown","mouseup"].forEach(function(e){!function(e){var t=X.events.getSafeEvent(e);function n(){i(t)}a.push({eventName:t,handler:n}),document.addEventListener(t,n)}(e)}),X.animate.callWhenLoaded(function(){i("animationready")}),X.broadcast.addCallback("unload",function(){a.forEach(function(e){document.removeEventListener(e.eventName,e.handler)}),a=null}))}),X.registerModule("managers/movie",["elements/animate","managers/hook"],function(){var e,t,n={isMock:!0,play:function(){e=!0},stop:function(){e=!1},gotoAndPlay:function(e){t=e},enact:function(){void 0!==e&&(e?X.movie.play():X.movie.stop()),void 0!==t&&X.movie.gotoAndPlay(t)}};X.movie={changeCallback:new X.classes.Callback,play:function(){n.play(),X.movie.changeCallback.sendToCallback("play")},stop:function(e){n.stop(e),X.movie.changeCallback.sendToCallback("stop",e)},gotoAndPlay:function(e){n.gotoAndPlay(e),n.play()},isPaused:function(){return n.paused},getLabels:function(){return n.labels?n.labels:[]},_setRootTimeline:function(e){var t=n;n=e,t.isMock&&t.enact(),X.movie.pause.setRootTimeline(e)}},X.animate.callWhenLoaded(function(){n.isMock&&X.movie.rootTimeline&&X.movie.rootTimeline.set(X.animate.mainTimeline)})}),X.registerModule("managers/preferences",[],function(){function a(){}return X.preferences={define:function(t){var n,e=function(e){n!==e&&(n=e,t.animateRequired?X.animate.callWhenLoaded(function(){t.method(n)}):t.method(n))};Object.defineProperty(a.prototype,t.name,{get:function(){return n},set:e}),t.default&&e(t.default)}},function(){X.preferences=new a}}),X.registerModule("managers/runInCaptivateWindow",["elements/captivate"],function(){"use strict";X.runInCaptivateWindow=function(e,t){if(X.captivate.extra){var n="("+e.toString()+"())";n&&X.captivate.extra.safeEval(n,t)}}}),X.registerModule("managers/utils",function(){"use strict";function e(o,s){function t(e,t){var n,a,i,r=Array.prototype.slice.call(t);return n=r,a=[],e.forEach(function(e){e===X.utils.__&&0<n.length?a.push(n.shift()):a.push(e)}),e=a.concat(n),i=e,X.utils.reduce(function(e,t){return e===X.utils.__?t:t+1},0,i)>=o?s.apply(null,e):l(e)}function l(e){return function(){return t(e,arguments)}}return l([])}X.utils={isMobile:"ontouchstart"in document.documentElement,callIfDefined:function(e){if(e){var t=Array.prototype.slice.call(arguments);return t=t.splice(1,t.length),e.apply(null,t)}},onNextTick:function(t){return function(){var e=arguments;createjs&&createjs.Ticker&&createjs.Ticker.on("tick",function(){t.apply(null,e)},null,!0)}},add:e(2,function(e,t){return e+t}),subtract:e(2,function(e,t){return e-t}),converge:e(3,function(e,t,n){for(var a=[],i=0;i<t.length;i+=1)a.push(t[i](n));return e.apply(null,a)}),singleton:function(e){var t=!1;return function(){t||(e.apply(null,arguments),t=!0)}},hasSuffix:function(e,t){return e.substring(e.length-t.length,e.length)===t},callByType:function(e,t){switch(typeof e){case"string":return X.utils.callIfDefined(t.string,e);case"number":return X.utils.callIfDefined(t.number,e);case"object":return e.constructor===Array?X.utils.callIfDefined(t.array,e):X.utils.callIfDefined(t.object,e)}},isEmpty:function(e){return X.utils.callByType(e,{object:function(e){return Object.keys(e).length<=0},array:function(e){return e.length<=0}})},filter:function(e,i){var t={array:function(e){var t=[];return e.forEach(function(e){i(e)&&t.push(e)}),t},object:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&i(n,e[n])&&(t[n]=e[n]);return t},string:function(e){for(var t,n="",a=0;a<e.length;a+=1)t=e[a],i(t)&&(n+=t);return n}};return X.utils.callByType(e,t)},forEach:function(e,n){X.utils.callByType(e,{array:function(e){e.forEach(n)},object:function(e){for(var t in e)e.hasOwnProperty(t)&&n(t,e[t])}})},forEachUntil:e(3,function(n,a,i){return X.utils.callByType(i,{array:function(){for(var e=0;e<i.length;e+=1){var t=a(i[e]);if(n(t))return t}},object:function(){for(var e in i)if(i.hasOwnProperty(e)){var t=a(i[e]);if(n(t))return t}}})}),forEachUntilResult:function(e,t){return X.utils.forEachUntil(function(e){return void 0!==e},e,t)},drop:e(2,function(a,e){return X.utils.callByType(e,{string:function(e){return e.substring(a,e.length)},array:function(e){for(var t=[],n=a;n<e.length;n+=1)t.push(e[n]);return t}})}),indexOf:e(2,function(e,t){return t.indexOf(e)}),identity:function(e){return e},T:function(){return!0},F:function(){return!1},pipeLog:function(e){return console.log(e),e},whenAllParametersValid:e(2,function(){var e=Array.prototype.slice.call(arguments),t=e[0],n=X.utils.drop(1,e);return X.utils.any(X.utils.isNil,n)?e[0]:t.apply(null,n)}),any:e(2,function(e,t){return X.utils.pipe(X.utils.forEachUntil(X.utils.identity,e),X.utils.when(X.utils.isNil,X.utils.F))(t)}),defaultTo:function(e,a){return X.utils.forEach(e,function(e,t){if(null!==t&&"object"==typeof t){var n=a[e];n||(n={}),a[e]=X.utils.defaultTo(t,n)}else a.hasOwnProperty(e)||(a[e]=t)}),a},getMissingProps:function(e,t){var n=[];return X.utils.forEach(e,function(e){t.hasOwnProperty(e)||n.push(e)}),n},ifElse:function(e,t,n){return function(){return e.apply(null,arguments)?t.apply(null,arguments):n.apply(null,arguments)}},when:function(e,t){return X.utils.ifElse(e,t,X.utils.identity)},unless:function(e,t){return X.utils.ifElse(e,X.utils.identity,t)},getPercent:function(e,t,n){return(n-e)/(t-e)},minMax:function(e,t,n){return n=Math.min(n,t),n=Math.max(n,e)},calculatePercentInRange:function(e,t,n){return(t-e)*n+e},reduce:function(t,n,e){return X.utils.forEach(e,function(e){n=t(e,n)}),n},within:e(3,function(e,t,n){return e<=n&&n<=t}),both:function(t,n){return function(e){return t(e)&&n(e)}},either:function(t,n){return function(e){return t(e)||n(e)}},map:e(2,function(i,e){return X.utils.callByType(e,{array:function(){var n=[];return X.utils.forEach(e,function(e){var t=i(e);n.push(t)}),n},object:function(){var a={};return X.utils.forEach(e,function(e,t){var n=i(t);a[e]=n}),a}})}),__:{},curry:e,pipe:function(){var t=Array.prototype.slice.call(arguments);return function(e){return X.utils.reduce(function(e,t){return e(t)},e,t)}},complement:function(t){return function(){var e=t.apply(null,arguments);return"function"==typeof e?X.utils.complement(e):!e}},removeWhiteSpace:function(e){if("string"==typeof e)return e.replace(/\s/g,"")},split:e(2,function(e,t){if(e&&t)return t.split(e)}),isType:e(2,function(e,t){return typeof t===e}),isNil:function(e){return""===e||null==e||isNaN(e)&&"number"==typeof e},isNotNil:function(e){return!X.utils.isNil(e)},invert:function(e){return!e},isIndexEmpty:e(2,function(e,t){return X.utils.isNil(t[e])}),isRange:function(e){return X.utils.pipe(X.utils.getRangeObject,X.utils.isNil,X.utils.invert)(e)},getRangeObject:function(e){return X.utils.pipe(X.utils.removeWhiteSpace,X.utils.split("-"),X.utils.map(parseInt),function(e){var t=X.utils.isIndexEmpty(X.utils.__,e);switch(e.length){case 3:e=t(0)?[-1*e[1],e[2]]:t(1)?[e[0],-1*e[2]]:null;break;case 4:t(0)&&t(2)&&(e=[-1*e[1],-1*e[3]])}return null===e?[NaN]:{start:e[0],end:e[1]}},X.utils.when(X.utils.any(X.utils.isNil),X.utils.always(null)))(e)},always:function(e){return function(){return e}},tap:e(2,function(e,t){return e(t),t}),allPass:e(2,function(e,t){for(var n=0;n<e.length;n+=1)if(!e[n](t))return!1;return!0}),prop:e(2,function(e,t){return t[e]}),propEq:e(3,function(e,t,n){return n[e]===t}),has:e(2,function(t,n){return X.utils.callByType(n,{object:function(e){return e.hasOwnProperty(t)},array:function(){for(var e=0;e<n.length;e+=1)if(n[e]===t)return!0;return!1}})}),hasnt:e(2,function(e,t){return!X.utils.has(e,t)})}}),X.registerModule("managers/preferences/debug",["managers/preferences"],function(){X.preferences.define({name:"debug",animateRequired:!0,method:function(e){X.debugWindow.update({enabled:e})}})}),X.registerModule("preferences/disableIFrameBorder",["managers/preferences","elements/slideObject"],function(){X.preferences.define({name:"disableIFrameBorder",method:function(e){X.captivate.isLoaded()&&(X.slideObject.div.style.border=e?"0px":"1px")},default:!1})}),X.registerModule("preferences/linkNameToLibrarySymbol",["managers/preferences","elements/slideObject","managers/movie","elements/animate"],function(){X.preferences.define({name:"linkNameToLibrarySymbol",animateRequired:!0,method:function(e){if(e&&X.slideObject){var t=function(){var e=X.slideObject.name;if(X.animate.library[e])return e;var t=e.lastIndexOf("_");0<t&&(e=e.substring(0,t));if(X.animate.library[e])return e;return!1}();t?X.movie.rootTimeline.set(t):X.log("Could not find a symbol by the name of '"+X.slideObject.name+"'. Perhaps this animation is only included to preload other animations?")}},default:!1})}),X.registerModule("managers/preferences/preview",["managers/preferences"],function(){"use strict";X.preferences.define({name:"preview",animateRequired:!0,method:function(e){X.captivate.isLoaded()||(X.movie.rootTimeline.set(e),document.addEventListener("click",X.movie.play))}})}),X.registerModule("preferences/publishSettings",["managers/preferences"],function(){var e={BOTH:"both",WIDTH:"width",HEIGHT:"height"},t={FIT_IN_VIEW:1,STRETCH_TO_FIT:2};function n(){X.resizeCanvas&&X.resizeCanvas()}X.preferences.define({name:"makeResponsive",animateRequired:!1,method:n,default:!0}),X.preferences.define({name:"responsiveDirections",animateRequired:!1,method:function(e){},default:e}),X.preferences.define({name:"responsiveDirection",animateRequired:!1,method:n,default:e.BOTH}),X.preferences.define({name:"scaleTypes",animateRequired:!1,method:function(e){},default:t}),X.preferences.define({name:"scaleType",animateRequired:!1,method:n,default:t.FIT_IN_VIEW}),X.preferences.define({name:"outerRendering",animateRequired:!1,method:n,default:!1})}),X.registerModule("preferences/size",["managers/preferences","elements/animate"],function(){function e(){X.resizeCanvas&&X.resizeCanvas()}X.preferences.define({name:"stageWidth",animateRequired:!1,method:e,default:null}),X.preferences.define({name:"stageHeight",animateRequired:!1,method:e,default:null}),X.animate.callWhenLoaded(function(){void 0===X.preferences.stageWidth&&(X.preferences.stageWidth=X.animate.library.properties.width),void 0===X.preferences.stageHeight&&(X.preferences.stageHeight=X.animate.library.properties.height)})}),X.registerModule("useRAFTiming",["managers/preferences"],function(){"use strict";X.preferences.define({name:"useRAFTiming",animateRequired:!0,method:function(e){createjs&&createjs.Ticker?createjs.Ticker.timingMode=e?createjs.Ticker.RAF_SYNCHED:null:console.error("Tried to change createjs.Ticker timing mode before it was loaded")},default:!0})}),X.registerModule("managers/actions/exitslide",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions.register("exitslide",function(){})}),X.registerModule("managers/actions/gotoFrameLabel",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions&&X.cpExtraActions.register("gotoFrameLabel",function(e){X.animate.callWhenLoaded(function(){!function(e){var t,n=X.movie.getLabels();e=e.toString();for(var a=0;a<n.length;a+=1)if((t=n[a]).label===e)return X.movie.gotoAndPlay(t.position)}(e)})})}),X.registerModule("managers/actions/playAndStop",["managers/cpExtraActions"],function(){"use strict";function e(e,t){X.cpExtraActions.register(e,function(){X.animate.callWhenLoaded(function(){t()})})}X.cpExtraActions&&(e("movieResume",function(){X.movie.isPaused()&&X.movie.pause.reason===X.movie.pause.type.CAPTIVATE_PAUSED&&X.movie.play()}),e("moviePause",function(){X.movie.isPaused()||X.movie.stop(X.movie.pause.type.CAPTIVATE_PAUSED)}))}),X.registerModule("managers/actions/unload",["managers/cpExtraActions"],function(){"use strict";function e(){window.removeEventListener("unload",e),X.cpExtraActions.unload(),X.broadcast.sendToCallback("unload")}X.cpExtraActions.register("unload",e),window.addEventListener("unload",e)}),X.registerModule("managers/debugging/errors",function(){X.errors={GE001:function(){return"You have not loaded CpExtra into Captivate. CpMate cannot work if CpExtra is not installed in Captivate. Either install CpExtra or remove CpMate."},GE002:function(e,t){return"CPEXTRA NEEDS TO BE UPGRADED. The current version of CpExtra is "+e+". But the minimum version of CpExtra needed to work with CpMate is "+t+". PLEASE UPGRADE CPEXTRA NOW."},CO001:function(e){return"The required property for slider/dial data ''"+e+"'' was not provided"},CO002:function(e){return"The variable defined for the slider/dial interaction '"+e+"' does not exist'"},CO003:function(e){return"The evaluate settings for a slider/dial interaction did not have the required '"+e+"' property defined."},PR001:function(e){return"Could not find a matching variable for movie clip named: '"+e+"'"},PR002:function(e,t,n){return"Prefix "+t+" can only work with a Dynamic Text object. Please ensure the object named "+n+"is a text object and not a MovieClip that contains a text object."}}}),X.registerModule("managers/debugging/logging",["managers/debugging/errors"],function(){var n;X.activateOnScreenLogging=function(){var e=document.createElement("P"),t=document.createTextNode("On screen logging activated");e.appendChild(t),document.body.appendChild(e),n=function(e){t.textContent=e}},X.log=function(e){n?n(e):console.log(e)},X.alert=function(e,t){X.captivate.isLoaded()?X.captivate.alert(e,t):alert(e)},X.error=function(e,t){var n="CpMate Error";if(X.errors.hasOwnProperty(e)){var a=Array.prototype.slice.call(arguments);a.splice(0,1),t=X.errors[e].apply(this,a),n+=": "+e}else t=e;X.alert(t,n)}}),X.registerModule("managers/movie/children",["managers/hook","managers/movie/rootTimeline","managers/utils"],function(){"use strict";X.movie.children={newChildCallback:new X.classes.Callback};var a={};var e=X.utils.pipe(X.utils.prop("name"),X.utils.isNotNil),t=(X.utils.complement(e),function(e){return X.utils.has(e,a[e.name])}),n=X.utils.complement(t),i=X.utils.either(X.utils.hasnt("_off"),X.utils.propEq("_off",!1)),r=X.utils.complement(i),o=X.utils.allPass([e,i,n]),s=X.utils.allPass([e,r,t]),l=X.utils.when(o,function(e){var t;a[(t=e).name]||(a[t.name]=[]),a[t.name].push(t),X.movie.children.newChildCallback.sendToCallback(e.name,e),X.movie.children.newChildCallback.sendToCallback("*",e)}),c=X.utils.when(s,function(e){var t=a[e.name];if(t){var n=t.indexOf(e);t.splice(n,1)}}),u=X.utils.pipe(X.utils.tap(l),c);X.addHookAfter(createjs.MovieClip.prototype,"_addManagedChild",u)}),X.registerModule("managers/movie/pause",["managers/movie"],function(){"use strict";var t;function n(e){e||(e=X.movie.pause.type.FRAME_SCRIPT),X.movie.pause.reason=e}X.movie.pause={type:{FRAME_SCRIPT:"frame_script",CAPTIVATE_PAUSED:"captivate_paused"},setRootTimeline:function(e){t&&X.removeHook(t,"stop",n),t=e,X.addHook(t,"stop",n)},reason:null}}),X.registerModule("managers/movie/rootTimeline",["managers/movie","classes/Callback"],function(){"use strict";var a;X.movie.rootTimeline={changeCallback:new X.classes.Callback,set:function(e){if(X.animate&&X.animate.library)if("string"==typeof e)if(X.animate.library.hasOwnProperty(e)){var t=new X.animate.library[e];X.animate.mainTimeline.addChild(t),n(t)}else X.error("Could not find symbol with name "+e+" in library. Therefore was unable to add it as root timeline.");else n(e);else console.log("Tried to set root timeline before animate loaded");function n(e){a=e,X.movie._setRootTimeline(e),X.movie.rootTimeline.changeCallback.sendToCallback("*",e)}},get:function(){return a}}}),X.registerModule("managers/prefix/displayObjectName",["managers/movie/children","managers/utils"],function(){var n={};X.registerDisplayObjectNamePrefix=function(e,t){n[e]=t,n[e.toLowerCase()]=t},X.movie.children.newChildCallback.addCallback("*",function(e){var t=e.name.split("_")[0];n.hasOwnProperty(t)&&n[t](e)})}),X.registerModule("managers/prefix/registerDisplayObjectNameAndSlideObjectData",["managers/prefix/displayObjectName","managers/utils"],function(){var e,t,n=X.utils.pipe(X.utils.prop("name"),(e="_",X.utils.converge(X.utils.drop,[(t=e,X.utils.pipe(X.utils.indexOf(t),X.utils.add(1))),X.utils.identity]))),a=X.utils.pipe(n,X.utils.whenAllParametersValid(function(e){return X.captivate.extra.dataManager.getSlideObjectDataByName(e)}));X.registerDisplayObjectNameAndSlideObjectData=function(e,t){X.utils.when(X.captivate.hasCpExtra,function(){X.registerDisplayObjectNamePrefix(e,X.utils.converge(X.utils.whenAllParametersValid(t),[X.utils.identity,a]))})()}}),X.registerModule("managers/prefix/displayObjectNameAndVariable",["managers/prefix/displayObjectName"],function(){function r(e){var t,n=e.split("_"),a=n.splice(1,n.length-1),i=function(e){var t,n,a,i=e.length-1;for(;0<=i;){if(t=e.concat(),n=t.splice(0,i+1),a=o(n),X.cpVariablesManager.hasVariable(a))return a;i--}return null}(a);return i||(X.captivate.hasCpExtra()?void X.error("PR001",e):(t=o(a),X.cpVariablesManager.setVariableValue(t,""),r(e)))}function o(e){var t=X.utils.reduce(n,"",e);return t.substring(1,t.length)}function n(e,t){return t+"_"+e}X.registerDisplayObjectNamePrefixAndVariable=function(e,a){X.registerDisplayObjectNamePrefix(e,function(t){function e(){var e=X.cpVariablesManager.getVariableValue(n);a(t,e)}var n=r(t.name);if(n){X.cpVariablesManager.listenForVariableChange(n,e);X.cpVariablesManager.getVariableValue(n);e()}})}}),X.registerModule("managers/components/slider/controller",["managers/utils","managers/components/slider/validator"],function(){X.slider.controller=function(e,n,a){var i,r,o,t,s=a.handle.x,l=a.handle.y,c=window.devicePixelRatio||1;function u(){return X.animate.stage.mouseX/c}function d(){return X.animate.stage.mouseY/c}return r=X.events.getSafeEvent("mousemove"),o=X.events.getSafeEvent("mouseup"),t=X.events.getSafeEvent("mousedown"),e.listenToTrack(t,function(){}),e.listenToHandle(t,function(){function t(){n.dragMove(u(),d()),s===a.handle.x&&l===a.handle.y||(s=a.handle.x,l=a.handle.y,0)||i.dragMove()}n.dragStart(u(),d()),document.addEventListener(r,t),document.addEventListener(o,function e(){n.dragEnd(),i.dragEnd(),document.removeEventListener(r,t),document.removeEventListener(o,e)})}),i=a.evaluate?X.slider.evaluate(a.evaluate,a.variable):{dragMove:function(){},dragEnd:function(){}},{}}}),X.registerModule("managers/components/slider/evaluate",["managers/mouseEvents","managers/utils","managers/components/slider/validator"],function(){X.slider.evaluate=function(t,e){var i,o=[],n=function(e){return function(){return!!t.on&&t.on.toLowerCase()===e}},a=n("continually"),r=n("mouseup"),s=n("button"),l=X.utils.either(a,r);function c(e){switch(typeof e){case"function":e();break;case"string":X.captivate.hasCpExtra()&&X.captivate.extraCallActionOn(e)}}var u=X.utils.when(function(){return t.on?!!t.criteria||(X.error("CO003","criteria"),!1):(X.error("CO003","on"),!1)},function(){var r;r=[],X.utils.forEach(t.criteria,function(e){var t,n,a=d(e.if);if(a.length&&1!==a.length){var i=(t=a,n=e.then,X.utils.map(function(e){return{if:e,then:n}},t));r=r.concat(i)}else r.push(e)}),t.criteria=r,X.utils.forEach(t.criteria,function(t){if("default"!==t.if){var n,a=(n=t.if,X.utils.forEachUntilResult(function(t){if(t.isValid(n))return function(e){return t.method(n,e)}},X.slider.evaluateMethods));a&&o.push(function(e){return!!a(e)&&(c(t.then),!0)})}else i=t.then}),s()&&t.button&&t.button.addEventListener(X.events.getSafeEvent("click"),f)});var d=X.utils.when(X.utils.isType("string"),X.utils.pipe(X.utils.removeWhiteSpace,X.utils.split(",")));function f(){var t=X.cpVariablesManager.getVariableValue(e),n=!1;X.utils.forEach(o,function(e){e(t)&&(n=!0)}),!n&&i&&c(i)}return u(),{dragMove:X.utils.when(a,f),dragEnd:X.utils.when(l,f)}}}),X.registerModule("managers/components/slider/model",["managers/utils","managers/components/slider/validator"],function(){X.slider.model=function(l){var t,i=l.variable,n=!1,c="vertical"===l.orientation,u=0,d={handlePosition:0},a=new X.classes.DisplayObjectProxy(l.handle),e=new X.classes.DisplayObjectProxy(l.track);e.primary=c?a.primary="y":a.primary="x";var f=e.primaryAxis+e.primaryLength-a.primaryLength,p=e.primaryAxis;function r(e){return function(){e.apply(null,arguments),t(d)}}var o=X.utils.unless(function(){return n},r(function(){var e,t,n,a=X.cpVariablesManager.getVariableValue(i);d.handlePosition=(e=a,t=X.utils.getPercent(l.min,l.max,e),n=X.utils.minMax(0,1,t),X.utils.calculatePercentInRange(p,f,n))}));return X.captivate.hasCpExtra()||X.cpVariablesManager.setVariableValue(i,l.min),(X.cpVariablesManager.hasVariable(i)||(X.error("CO002",i),0))&&X.cpVariablesManager.listenForVariableChange(i,o),{updateTo:function(e){t=e,o()},dragStart:function(e,t){n=!0,u=c?t-a.y:e-a.x},dragMove:r(function(e,t){var n,a,i,r,o,s=(n=c?t:e,n-=u,n=Math.min(n,f),n=Math.max(n,p));a=s,i=X.utils.getPercent(p,f,a),r=X.utils.calculatePercentInRange(l.min,l.max,i),o=Math.round(r),X.cpVariablesManager.setVariableValue(l.variable,o),d.handlePosition=s}),dragEnd:function(){n=!1}}}}),X.registerModule("managers/components/slider/registerEvaluateMethod",["managers/components/slider/validator"],function(){X.slider.evaluateMethods={},X.slider.registerEvaluateMethod=function(e,t){X.slider.evaluateMethods[e]=t}}),X.registerModule("managers/components/slider/validator",["managers/utils"],function(){X.slider=function(r){!function(){if(i=X.utils.getMissingProps(["variable","handle","track"],r),!(0<i.length)||(X.utils.forEach(i,function(e){X.error("CE001",e)}),0)){var e,t,n,a=X.utils.defaultTo({min:0,max:100,reverse:!1,orientation:"vertical",hideTrack:!1,scrollUp:null,scrollDown:null,attachedItems:null,trackClicking:!1,throwingFriction:0,handCursor:!0,scrollWhenOver:!1,scroll:!1,scrollStep:10},r);e=a,t=X.slider.model(e),n=X.slider.view(e),X.slider.controller(n,t,e),t.updateTo(n.update)}var i}()}}),X.registerModule("managers/components/slider/view",["managers/utils","managers/components/slider/validator"],function(){X.slider.view=function(n){var e=n.handle,t=n.track,a=new X.classes.DisplayObjectProxy(e),i=new X.classes.DisplayObjectProxy(t),r="v"===("vertical"===n.orientation?"v":"h")?"y":"x";return a.primary=r,i.primary=r,a.primaryAxis=i.primaryAxis,a.secondaryAxis=i.secondaryAxis+(i.secondaryLength-a.secondaryLength)/2,{track:n.track,handle:n.handle,listenToTrack:function(e,t){n.track.addEventListener(e,t)},listenToHandle:function(e,t){n.handle.addEventListener(e,t)},update:function(e){a.primaryAxis=e.handlePosition}}}}),X.registerModule("managers/prefixes/registees/xBind",["managers/utils","managers/prefix/displayObjectNameAndVariable"],function(){function e(i){return function(e,t){var n=new X.classes.MovieClipProxy(e);if(n.hasLabel(t)){var a=n.getLabelFrame(t);n[i](a)}else n[i](0)}}var t=X.utils.onNextTick(e("gotoAndStop")),n=e("gotoAndPlay");X.registerDisplayObjectNamePrefixAndVariable("xBind",t),X.registerDisplayObjectNamePrefixAndVariable("xBindStop",t),X.registerDisplayObjectNamePrefixAndVariable("xBindPlay",n)}),X.registerModule("managers/prefixes/registees/xPause",["managers/prefix/displayObjectName"],function(){X.registerDisplayObjectNamePrefixAndVariable("xPause",function(e,t){X.movie.changeCallback.addCallback("play",function(){e.play()}),X.movie.changeCallback.addCallback("stop",function(){e.stop()})})}),X.registerModule("managers/prefixes/registees/xTextFromAccessibilityText",["managers/utils","managers/prefix/displayObjectNameAndVariable"],function(){var a="xTextFromAccessibilityText";X.registerDisplayObjectNameAndSlideObjectData(a,function(e,t){console.log(t);var n=new X.classes.TextFieldProxy(e);n.valid?(n.text=t.accessibilityText,console.log(n.text)):X.error("PR002",a,e.name)})}),X.registerModule("managers/prefixes/registees/xTextFromCaption",["managers/utils","managers/prefix/displayObjectNameAndVariable"],function(){var a="xTextFromCaption";X.registerDisplayObjectNameAndSlideObjectData(a,function(e,t){var n=new X.classes.TextFieldProxy(e);n.valid?n.text=t.text:X.error("PR002",a,e.name)})}),X.registerModule("managers/prefixes/registees/xTextFromVariable",["managers/utils","managers/prefix/displayObjectNameAndVariable"],function(){var a="xTextFromVariable";X.registerDisplayObjectNamePrefixAndVariable(a,function(e,t){var n=new X.classes.TextFieldProxy(e);n.valid?n.text=t:X.error("PR002",a,e.name)})}),X.registerModule("managers/components/slider/evaluateMethods/equal",["managers/components/slider/registerEvaluateMethod"],function(){X.slider.registerEvaluateMethod("equals",{isValid:X.utils.complement(isNaN),method:function(e,t){return parseInt(e)===parseInt(t)}})}),X.registerModule("managers/components/slider/evaluateMethods/range",["managers/components/slider/registerEvaluateMethod"],function(){X.slider.registerEvaluateMethod("range",{isValid:X.utils.isRange,method:function(e,t){var n=X.utils.getRangeObject(e);return X.utils.within(n.start,n.end,t)}})});