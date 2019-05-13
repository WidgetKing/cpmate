/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/actions/gotoFrameLabel", ["managers/cpExtraActions"], function () {

    "use strict";

    if (!X.cpExtraActions) {
        return;
    }

    function gotoFrameLabel (frameLabel) {

		console.log("Going to label: " + frameLabel);
        var labels = X.movie.getLabels(),
            labelData;

        frameLabel = frameLabel.toString();

        for (var i = 0; i < labels.length; i += 1) {

            labelData = labels[i];

            if (labelData.label === frameLabel) {
                X.movie.gotoAndPlay(labelData.position);
                return;
            }

        }

    }



    ///////////////////////////////////////////////////////////////////////
    /////////////// REGISTER
    ///////////////////////////////////////////////////////////////////////

    X.cpExtraActions.register("gotoFrameLabel", function (frameLabel) {

        // Make sure the animate runtime has already loaded.
        X.animate.callWhenLoaded(function () {

            gotoFrameLabel(frameLabel);

        })

    });

});
