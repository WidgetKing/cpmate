/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/1/18
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/debugging/errors", function () {

    X.errors = {

        ///////////////////////////////////////////////////////////////////////
        /////////////// GENERAL ERRORS (GE)
        ///////////////////////////////////////////////////////////////////////

        "GE001":function () {
            return "You have not loaded CpExtra into Captivate. CpMate cannot work if CpExtra is not installed in Captivate. Either install CpExtra or remove CpMate.";
        },

        "GE002": function (currentVersion, minimumVersion) {
            return "CPEXTRA NEEDS TO BE UPGRADED. The current version of CpExtra is " + currentVersion + ". But the minimum version of CpExtra needed to work with CpMate is " + minimumVersion + ". PLEASE UPGRADE CPEXTRA NOW."
        },

        ////////////////////////////////////////
        ////////// COMPONENT ERRORS
        ////////////////////////////////////////
        "CO001": function (property) {
            return "The required property for slider/dial data ''" + property + "'' was not provided";
        },
        "CO002": function (name) {
            return "The variable defined for the slider/dial interaction '" + name + "' does not exist'";
        },

		////////////////////////////////////////
		////////// PREFIX ERRORS
		////////////////////////////////////////
		"PR001": function (clipName) {
			return "Could not find a matching variable for movie clip named: '" + clipName + "'";
		}
    };

});
