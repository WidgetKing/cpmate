/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/25/18
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    function isInCaptivate() {

        return window.parent.hasOwnProperty("cp");

    }

    window.deleteme = isInCaptivate;
}());