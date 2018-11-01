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

    X.alert = function (message) {
        if (X.captivate.isLoaded()) {
            X.captivate.alert(message);
        } else {
            alert(message);
        }
    };

    X.error = function (errorCode, message) {

        if (X.errors.hasOwnProperty(errorCode)) {

            // Get array of all arguments except the first one.
            // We will need to pass this on to the error function.
            var args = Array.prototype.slice.call(arguments);
            args.splice(0,1);

            message = X.errors[errorCode].apply(this, args);

        } else {

            message = errorCode;

        }

        X.alert(message);

    };

});