/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */
window.unitTests = {
    "moduleList":{},
    "registerModule":function (name, method) {
        unitTests.moduleList[name] = method;
    },
    "requestModule": function(name) {
        return unitTests.moduleList[name];
    }
};

window.X = window.unitTests;