/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/29/18
 * Time: 5:00 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("preferences/preferenceManager", function () {

    function Preferences() {

    }

    X.preferences = {
        "define":function (name, setMethod) {

            var value;

            Object.defineProperty(Preferences.prototype, name, {
                "get":function () {
                    return value;
                },
                "set":function (incomingValue) {
                    value = incomingValue;
                    setMethod(value);
                }
            });

        }
    };

    return function () {
        X.preferences = new Preferences();
    };
});