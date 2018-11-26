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