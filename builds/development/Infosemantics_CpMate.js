!function(){if(!window.unitTests){window.X={version:"0.0.2",build:"999"};var u={},t=[];X.registerModule=function(e,t,a){var n,i,r,o=!0;function s(e){return u[e]={subordinates:{},instantiated:!1},u[e]}function l(e,t){u[e].subordinates[t]=u[t],o=!1}if("function"==typeof t?(a=t,t=[]):"string"==typeof t&&(t=[t]),u[e]){if(void 0!==u[e].dependencies)throw Error("Tried to register two modules under the name: "+e)}else s(e);(n=u[e]).dependencies=t,n.moduleConstructor=a;for(var c=0;c<n.dependencies.length;c+=1){if(i=n.dependencies[c],r=u[i],i===e)throw new Error("Can't set up a module as a dependency of itself");r?r.instantiated||l(i,e):(r=s(i),l(i,e))}o&&d(e)},window.addEventListener("load",function(){!function(){for(var e=0;e<t.length;e+=1)d(t[e]);t=[]}(),function(){var e;for(var t in u)if(u.hasOwnProperty(t)&&(e=u[t]).onLoadCallback)try{e.onLoadCallback()}catch(e){console.error("Encountered error at module: "+t+"<br/>Details: <br/>"+e)}}()})}function d(e){var t,a,n=u[e];for(var i in n.onLoadCallback=n.moduleConstructor(),n.instantiated=!0,n.subordinates)if(n.subordinates.hasOwnProperty(i)){if((t=u[i]).instantiated)continue;a=!0;for(var r=0;r<t.dependencies.length;r+=1)if(!u[t.dependencies[r]].instantiated){a=!1;break}a&&d(i)}}}(),X.registerModule("elements/animate",function(){"use strict";var t,a=[];function n(){return window.stage}function i(){if(n()){window.clearInterval(t);for(var e=0;e<a.length;e+=1)a[e]();a=t=null}}X.animate={callWhenLoaded:function(e){n()?t?(a.push(e),i()):e():(a.push(e),t||(t=window.setInterval(i,10)))}},X.animate.callWhenLoaded(function(){X.animate.stage=stage,X.animate.mainTimeline=stage.children[0],window.AdobeAn&&(X.animate.library=AdobeAn.getComposition(AdobeAn.bootcompsLoaded[0]).getLibrary())})}),X.registerModule("elements/captivate",["managers/debugging/logging"],function(){var e="1.4.2";X.captivate={isLoaded:function(){return window.parent&&window.parent.hasOwnProperty("cp")},hasCpExtra:function(){return!!X.captivate.window&&X.captivate.window.hasOwnProperty("_extra")},window:null,base:null,extra:null,variables:null},X.captivate.isLoaded()&&(X.captivate.window=window.parent,X.captivate.base=X.captivate.window.cp,X.captivate.alert=X.captivate.window.alert,X.captivate.variables=X.captivate.window,X.captivate.hasCpExtra()?(X.captivate.extra={},X.captivate.extra=X.captivate.window._extra,X.captivate.extraPublicInterface=X.captivate.window.X,X.captivate.extraVersion=X.captivate.extraPublicInterface.version,X.captivate.extraVersion<e&&X.error("GE002",X.captivate.extraVersion,e)):X.error("GE001"))}),X.registerModule("elements/slideObject",["elements/captivate","managers/broadcast"],function(){X.captivate.isLoaded()&&(X.slideObject={},X.slideObject.iframe=window.frameElement,X.slideObject.div=function(e,t,a){for(;e.parentElement;){if(e.getAttribute(t)===a)return e;e=e.parentElement}return null}(X.slideObject.iframe,"class","cp-WebObject"),X.slideObject.name=X.slideObject.div.getAttribute("id"),X.slideObject.name=X.slideObject.name.substring(0,X.slideObject.name.length-1),X.captivate.extra&&(X.slideObject.proxy=X.captivate.extra.slideObjects.getSlideObjectByName(X.slideObject.name))),X.broadcast.addCallback("unload",function(){X.slideObject&&delete X.slideObject.proxy})}),X.registerModule("managers/broadcast",["classes/Callback"],function(){"use strict";X.broadcast=new X.classes.Callback}),X.registerModule("managers/classes",function(){"use strict";X.classes={register:function(e,t){X.classes.hasOwnProperty(e)?console.log("Already registered a class by the name of: "+e):X.classes[e]=t}}}),X.registerModule("managers/cpExtraActions",["elements/captivate","elements/slideObject"],function(){"use strict";var a={};function e(e){e.action&&e.parameters?a.hasOwnProperty(e.action)?a[e.action].apply(null,e.parameters):X.error("Tried to enact CpMate action '"+e.action+"'. However, no such action was defined in CpMate."):X.error("When broadcasting an action to CpMate an action or parameter was not defined")}X.cpExtraActions={register:function(e,t){a[e]=t},unload:function(){X.captivate.extra.cpMate.deregister(X.slideObject.name,e),X.captivate.extra.cpMate.deregister("*",e)}},X.captivate&&X.captivate.extra&&(X.captivate.extra.cpMate.register(X.slideObject.name,e),X.captivate.extra.cpMate.register("*",e))}),X.registerModule("managers/cpVariablesManager",["managers/utils","elements/captivate"],function(){var e=X.captivate.hasCpExtra(),t=new X.classes.CallbackObject;X.cpVariablesManager={listenForVariableChange:e?X.captivate.extra.variableManager.listenForVariableChange:t.callback,setVariableValue:e?X.captivate.extra.variableManager.setVariableValue:t.setProp,getVariableValue:e?X.captivate.extra.variableManager.getVariableValue:t.getProp,hasVariable:e?X.captivate.extra.variableManager.getVariableValue:t.hasProp}}),X.registerModule("managers/dispatchLoadedEvent",function(){"use strict";return function(){var e,t;window.dispatchEvent((e="cpmateLoaded","function"==typeof Event?t=new Event(e):(t=document.createEvent("Event")).initEvent(e,!0,!0),t))}}),X.registerModule("managers/hook",function(){"use strict";var r=[];function n(e,t,a){var n={location:e,methodName:t,hookMethod:a,originalMethod:e[t]};return n.location[n.methodName]=function(){var e,t=arguments;if(n.callHookBeforeOriginal){if(e=n.hookMethod.apply(this,arguments),"[object Arguments]"===Object.prototype.toString.call(e))t=e;else if(void 0!==e)return e;return n.originalMethod.apply(this,t)}return e=n.originalMethod.apply(this,t),n.hookMethod.apply(this,arguments),e},r.push(n),n}function i(e){var t=r[e];t&&(r.splice(e,1),t.location[t.methodName]=t.originalMethod)}function o(e,t,a){for(var n,i=0;i<r.length;i+=1)if((n=r[i]).location===e&&n.methodName===t&&(!a||n.hookMethod===a))return i;return-1}X.addHookAfter=function(e,t,a){n(e,t,a).callHookBeforeOriginal=!1},X.addHookBefore=function(e,t,a){n(e,t,a).callHookBeforeOriginal=!0},X.addHook=X.addHookAfter,X.hasHook=function(e,t){return-1<o(e,t)},X.removeHook=function(e,t,a){var n=o(e,t,a);return-1<n&&(i(n),!0)},X.addOneTimeHook=function(e,t,a){var n=function(){a.apply(this,arguments),X.removeHook(e,t,n)};X.addHookAfter(e,t,n)}}),X.registerModule("managers/mouseEvents",["elements/slideObject"],function(){"use strict";var a=[];if(X.slideObject&&X.slideObject.proxy){var e="ontouchstart"in document.documentElement;["click","doubleclick","contextmenu","mouseover","mouseout",e?"touchmove":"mousemove",e?"touchstart":"mousedown",e?"touchend":"mouseup"].forEach(function(e){!function(e){function t(){X.slideObject.proxy.dispatchEvent(e)}a.push({eventName:e,handler:t}),document.addEventListener(e,t)}(e)}),X.broadcast.addCallback("unload",function(){a.forEach(function(e){document.removeEventListener(e.eventName,e.handler)}),a=null})}}),X.registerModule("managers/movie",["elements/animate","managers/hook"],function(){var e,t,a={isMock:!0,play:function(){e=!0},stop:function(){e=!1},gotoAndPlay:function(e){t=e},enact:function(){void 0!==e&&(e?X.movie.play():X.movie.stop()),void 0!==t&&X.movie.gotoAndPlay(t)}};X.movie={changeCallback:new X.classes.Callback,play:function(){a.play(),X.movie.changeCallback.sendToCallback("play")},stop:function(e){a.stop(e),X.movie.changeCallback.sendToCallback("stop",e)},gotoAndPlay:function(e){a.gotoAndPlay(e),a.play()},isPaused:function(){return a.paused},getLabels:function(){return a.labels?a.labels:[]},_setRootTimeline:function(e){var t=a;a=e,t.isMock&&t.enact(),X.movie.pause.setRootTimeline(e)}},X.animate.callWhenLoaded(function(){a.isMock&&X.movie.rootTimeline&&X.movie.rootTimeline.set(X.animate.mainTimeline)})}),X.registerModule("managers/preferences",function(){function n(){}return X.preferences={define:function(t){var a,e=function(e){a!==e&&(a=e,t.animateRequired?X.animate.callWhenLoaded(function(){t.method(a)}):t.method(a))};Object.defineProperty(n.prototype,t.name,{get:function(){return a},set:e}),t.default&&e(t.default)}},function(){X.preferences=new n}}),X.registerModule("managers/runInCaptivateWindow",["elements/captivate"],function(){"use strict";X.runInCaptivateWindow=function(e,t){if(X.captivate.extra){var a="("+e.toString()+"())";a&&X.captivate.extra.safeEval(a,t)}}}),X.registerModule("managers/utils",function(){"use strict";X.utils={callIfDefined:function(e){if(e){var t=Array.prototype.slice.call(arguments);return t=t.splice(1,t.length),e.apply(null,t)}},onNextTick:function(t){return function(){var e=arguments;createjs&&createjs.Ticker&&createjs.Ticker.on("tick",function(){t.apply(null,e)},null,!0)}},singleton:function(e){var t=!1;return function(){t||(e.apply(null,arguments),t=!0)}},hasSuffix:function(e,t){return e.substring(e.length-t.length,e.length)===t},callByType:function(e,t){switch(typeof e){case"string":return X.utils.callIfDefined(t.string,e);case"number":return X.utils.callIfDefined(t.number,e);case"object":return e.constructor===Array?X.utils.callIfDefined(t.array,e):X.utils.callIfDefined(t.object,e)}},isEmpty:function(e){return X.utils.callByType(e,{object:function(e){return Object.keys(e).length<=0},array:function(e){return e.length<=0}})},filter:function(e,i){var t={array:function(e){var t=[];return e.forEach(function(e){i(e)&&t.push(e)}),t},object:function(e){var t={};for(var a in e)e.hasOwnProperty(a)&&i(a,e[a])&&(t[a]=e[a]);return t},string:function(e){for(var t,a="",n=0;n<e.length;n+=1)t=e[n],i(t)&&(a+=t);return a}};return X.utils.callByType(e,t)},forEach:function(e,a){X.utils.callByType(e,{array:function(e){e.forEach(a)},object:function(e){for(var t in e)e.hasOwnProperty(t)&&a(t,e[t])}})},defaultTo:function(e,n){return X.utils.forEach(e,function(e,t){if(null!==t&&"object"==typeof t){var a=n[e];a||(a={}),n[e]=X.utils.defaultTo(t,a)}else n.hasOwnProperty(e)||(n[e]=t)}),n},getMissingProps:function(e,t){var a=[];return X.utils.forEach(e,function(e){t.hasOwnProperty(e)||a.push(e)}),a}}}),X.registerModule("preferences/disableIFrameBorder",["managers/preferences","elements/slideObject"],function(){X.preferences.define({name:"disableIFrameBorder",method:function(e){X.captivate.isLoaded()&&(X.slideObject.div.style.border=e?"0px":"1px")},default:!1})}),X.registerModule("preferences/linkNameToLibrarySymbol",["managers/preferences","elements/slideObject","managers/movie","elements/animate"],function(){function a(){var e=X.slideObject.name;if(X.animate.library[e])return e;var t=e.lastIndexOf("_");return 0<t&&(e=e.substring(0,t)),!!X.animate.library[e]&&e}X.preferences.define({name:"linkNameToLibrarySymbol",animateRequired:!0,method:function(e){if(e&&X.slideObject){var t=a();t?X.movie.rootTimeline.set(t):X.log("Could not find a symbol by the name of '"+a()+"'. Perhaps this animation is only included to preload other animations?")}},default:!1})}),X.registerModule("preferences/pausingInstanceSuffix",["managers/preferences","managers/utils"],function(){"use strict";var a,n=X.utils.singleton(function(){X.movie.changeCallback.addCallback("play",function(){X.utils.forEach(a,function(e,t){t.play()})}),X.movie.changeCallback.addCallback("stop",function(){X.utils.forEach(a,function(e,t){t.stop()})})});X.preferences.define({name:"pausingInstanceSuffix",animateRequired:!0,method:function(e){function t(){a=X.movie.children.getListMatchingSuffix(e)}n(),X.movie.children.exist&&t(),X.movie.children.changeCallback.addCallback("*",t)}})}),X.registerModule("managers/preferences/preview",["managers/preferences"],function(){"use strict";X.preferences.define({name:"preview",animateRequired:!0,method:function(e){X.captivate.isLoaded()||(X.movie.rootTimeline.set(e),document.addEventListener("click",X.movie.play))}})}),X.registerModule("useRAFTiming",["managers/preferences"],function(){"use strict";X.preferences.define({name:"useRAFTiming",animateRequired:!0,method:function(e){createjs&&createjs.Ticker?createjs.Ticker.timingMode=e?createjs.Ticker.RAF_SYNCHED:null:console.error("Tried to change createjs.Ticker timing mode before it was loaded")},default:!0})}),X.registerModule("classes/Callback",["managers/classes"],function(){"use strict";X.classes.register("Callback",function(){this.data={};var s=this;function n(e){s.data[e]||(s.data[e]={overwritable:null,regular:[]})}this.addCallback=function(e,t,a){n(e),a?s.data[e].overwritable=t:s.data[e].regular.push(t)},s.addCallbackToFront=function(e,t){n(e),s.data[e].regular.unshift(t)},this.hasCallbackFor=function(e){return void 0!==s.data[e]},this.sendToCallback=function(e,t){var a,n,i=s.data[e];if(i){i.overwritable&&i.overwritable(t);for(var r=i.regular,o=0;o<r.length;o+=1)void 0!==(n=r[o](t))&&(a=n)}return a},this.forEach=function(e){var t;for(var a in s.data)if(s.data.hasOwnProperty(a)){s.data[a].overwritable&&e(a,s.data[a].overwritable),t=s.data[a].regular;for(var n=0;n<t.length;n+=1)e(a,t[n])}},this.removeCallback=function(e,t){var a=s.data[e];if(a){if(a.overwritable&&a.overwritable===t)return void delete a.overwritable;for(var n=a.regular,i=0;i<n.length;i+=1)if(t===n[i]){n.splice(i,1),n.length<=0&&delete s.data[e];break}}},this.removeIndex=function(e){delete s.data[e]},this.clear=function(){s.data={}}})},"class"),X.registerModule("classes/CallbackObject",["managers/classes"],function(){"use strict";X.classes.register("CallbackObject",function(){var a=new X.classes.Callback,n={};this.callback=a.addCallback,this.setProp=function(e,t){n[e]=t,a.sendToCallback(e,t),a.sendToCallback("*",t)},this.getProp=function(e){return n[e]},this.hasProp=function(e){return n.hasOwnProperty(e)}})},"class"),X.registerModule("managers/actions/exitslide",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions.register("exitslide",function(){})}),X.registerModule("managers/actions/gotoFrameLabel",["managers/cpExtraActions"],function(){"use strict";X.cpExtraActions&&X.cpExtraActions.register("gotoFrameLabel",function(e){X.animate.callWhenLoaded(function(){!function(e){var t,a=X.movie.getLabels();e=e.toString();for(var n=0;n<a.length;n+=1)if((t=a[n]).label===e)return X.movie.gotoAndPlay(t.position)}(e)})})}),X.registerModule("managers/actions/playAndStop",["managers/cpExtraActions"],function(){"use strict";function e(e,t){X.cpExtraActions.register(e,function(){X.animate.callWhenLoaded(function(){t()})})}X.cpExtraActions&&(e("movieResume",function(){X.movie.isPaused()&&X.movie.pause.reason===X.movie.pause.type.CAPTIVATE_PAUSED&&X.movie.play()}),e("moviePause",function(){X.movie.isPaused()||X.movie.stop(X.movie.pause.type.CAPTIVATE_PAUSED)}))}),X.registerModule("managers/actions/unload",["managers/cpExtraActions"],function(){"use strict";function e(){window.removeEventListener("unload",e),X.cpExtraActions.unload(),X.broadcast.sendToCallback("unload")}X.cpExtraActions.register("unload",e),window.addEventListener("unload",e)}),X.registerModule("managers/debugging/errors",function(){X.errors={GE001:function(){return"You have not loaded CpExtra into Captivate. CpMate cannot work if CpExtra is not installed in Captivate. Either install CpExtra or remove CpMate."},GE002:function(e,t){return"CPEXTRA NEEDS TO BE UPGRADED. The current version of CpExtra is "+e+". But the minimum version of CpExtra needed to work with CpMate is "+t+". PLEASE UPGRADE CPEXTRA NOW."},CO001:function(e){return"The required property for slider/dial data ''"+e+"'' was not provided"},CO002:function(e){return"The variable defined for the slider/dial interaction '"+e+"' does not exist'"}}}),X.registerModule("managers/debugging/logging",["managers/debugging/errors"],function(){X.log=function(e){console.log(e)},X.alert=function(e,t){X.captivate.isLoaded()?X.captivate.alert(e,t):alert(e)},X.error=function(e,t){var a="CpMate Error";if(X.errors.hasOwnProperty(e)){var n=Array.prototype.slice.call(arguments);n.splice(0,1),t=X.errors[e].apply(this,n),a+=": "+e}else t=e;X.alert(t,a)}}),X.registerModule("managers/movie/children",["managers/movie/rootTimeline","managers/utils"],function(){"use strict";X.movie.children={list:{},changeCallback:new X.classes.Callback,exist:!1,getListMatchingSuffix:function(a){return X.utils.filter(X.movie.children.list,function(e,t){return X.utils.hasSuffix(e,a)})}},X.movie.rootTimeline.changeCallback.addCallback("*",X.utils.onNextTick(function(e){X.movie.children.list=function(e){var t={};function a(e){e.name&&!t.hasOwnProperty(e.name)&&(t[e.name]=e)}return e.children&&function t(e){a(e),e.children.forEach(function(e){e.children&&0<e.children.length?t(e):a(e)})}(e),t}(e),X.movie.children.exist=!X.utils.isEmpty(X.movie.children.list),X.movie.children.changeCallback.sendToCallback("*")}))}),X.registerModule("managers/movie/pause",["managers/movie"],function(){"use strict";var t;function a(e){e||(e=X.movie.pause.type.FRAME_SCRIPT),X.movie.pause.reason=e}X.movie.pause={type:{FRAME_SCRIPT:"frame_script",CAPTIVATE_PAUSED:"captivate_paused"},setRootTimeline:function(e){t&&X.removeHook(t,"stop",a),t=e,X.addHook(t,"stop",a)},reason:null}}),X.registerModule("managers/movie/rootTimeline",["managers/movie","classes/Callback"],function(){"use strict";X.movie.rootTimeline={changeCallback:new X.classes.Callback,set:function(e){if(X.animate&&X.animate.library)if("string"==typeof e)if(X.animate.library.hasOwnProperty(e)){var t=new X.animate.library[e];X.animate.mainTimeline.addChild(t),a(t)}else X.error("Could not find symbol with name "+e+" in library. Therefore was unable to add it as root timeline.");else a(e);else console.log("Tried to set root timeline before animate loaded");function a(e){X.movie._setRootTimeline(e),X.movie.rootTimeline.changeCallback.sendToCallback("*",e)}}}}),X.registerModule("managers/components/slider/controller",["managers/utils","managers/components/slider/validator"],function(){X.slider.controller=function(e){return{}}}),X.registerModule("managers/components/slider/model",["managers/utils","managers/components/slider/validator"],function(){X.slider.model=function(e){var t,a=e.variable;function n(){value=X.cpVariablesManager.getVariableValue(a),t(value)}return(X.cpVariablesManager.hasVariable(a)||(X.error("CO002",a),0))&&X.cpVariablesManager.listenForVariableChange(a,n),{updateTo:function(e){t=e}}}}),X.registerModule("managers/components/slider/validator",["managers/utils"],function(){X.slider=function(r){!function(){if(i=X.utils.getMissingProps(["variable","handle","track"],r),!(0<i.length)||(X.utils.forEach(i,function(e){X.error("CE001",e)}),0)){var e,t,a,n=X.utils.defaultTo({min:0,max:100,reverse:!1,vertical:!0,horizontal:!1,hideTrack:!1,scrollUp:null,scrollDown:null,attachedItems:null,trackClicking:!1,throwingFriction:0,handCursor:!0,scrollWhenOver:!1,scroll:!1,scrollStep:10,evaluation:{}},r);e=n,t=X.slider.model(e),a=X.slider.view(e),X.slider.controller(a,t),t.updateTo(a.update)}var i}()}}),X.registerModule("managers/components/slider/view",["managers/utils","managers/components/slider/validator"],function(){X.slider.view=function(e){return{listenToTrack:e.track.addEventListener,listenToHandle:e.handle.addEventListener,update:function(){}}}});