/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 9:46 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/debugging/logging", ["managers/debugging/errors"], function () {

	////////////////////////////////////////
	////// ON SCREEN LOGGING
	
	var onScreenLog;

	X.activateOnScreenLogging = function () {
		var para = document.createElement("P");                       // Create a <p> node
		var t = document.createTextNode("On screen logging activated");      // Create a text node
		para.appendChild(t);                                          // Append the text to <p>
		document.body.appendChild(para); 

		onScreenLog = function (message) {

			t.textContent = message;

		}

	}

	////////////////////////////////////////
	////// GENERAL FUNCTIONS
	
    X.log = function (message) {
		if (onScreenLog) {
			onScreenLog(message);
		} else {
			console.log(message);
		}
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
