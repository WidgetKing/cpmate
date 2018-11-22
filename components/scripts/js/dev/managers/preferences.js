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