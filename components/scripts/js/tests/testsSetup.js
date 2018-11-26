/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */
window.unitTests = {
    "classes":{
        "register": function(className, classConstructor) {
            unitTests.classes[className] = classConstructor;
        }
    },
    "moduleList":{},
    "registerModule":function (name, dependancies, method, isClass) {
        if (!Array.isArray(dependancies)) {
            method = dependancies;
            isClass = method;
        }
        unitTests.moduleList[name] = method;

        if (isClass === "class") {
            method();
        }
    },
    "requestModule": function(name) {
        return unitTests.moduleList[name];
    }
};

window.X = window.unitTests;