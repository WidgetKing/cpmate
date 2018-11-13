/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("gotoFrameLabel", ["managers/cpExtraActions"], function () {

    "use strict";

    if (X.cpExtraActions) {

        X.cpExtraActions.register("gotoFrameLabel", function (frameLabel) {

            var labels = X.animate.mainTimeline.labels,
                labelData;

            frameLabel = frameLabel.toString();

            for (var i = 0; i < labels.length; i += 1) {

                labelData = labels[i];

                if (labelData.label === frameLabel) {

                    X.animate.mainTimeline.gotoAndPlay(labelData.position);
                    return;

                }

            }

        });

    }

});