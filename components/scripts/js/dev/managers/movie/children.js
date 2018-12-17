/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 12/17/18
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */
X.registerModule("managers/movie/children", ["managers/movie/rootTimeline", "managers/utils"], function () {

    "use strict";

    X.movie.children = {
        "list":{},
        "changeCallback": new X.classes.Callback(),
        "exist": false,
        "getListMatchingSuffix": function (suffix) {

            return X.utils.filter(X.movie.children.list, function (name, value) {

                return X.utils.hasSuffix(name, suffix);

            });

        }
    };

    function getDeepListOfChildren (timeline) {

        var newChildren = {};

        function addChild (child) {
            if (child.name && !newChildren.hasOwnProperty(child.name)) {
                newChildren[child.name] = child;
            }
        }


        function inspectChildren (parent) {

            addChild(parent);

            parent.children.forEach(function (child) {

                if (child.children && child.children.length > 0) {

                    inspectChildren(child);

                } else {

                    addChild(child);

                }

            })

        }

        if (timeline.children) {
            inspectChildren(timeline);
        }

        return newChildren;

    }



    function handleNewTimeline (timeline) {

        X.movie.children.list = getDeepListOfChildren(timeline);

        X.movie.children.exist = !X.utils.isEmpty(X.movie.children.list);

        X.movie.children.changeCallback.sendToCallback("*");

    }

    X.movie.rootTimeline.changeCallback.addCallback("*", X.utils.onNextTick(handleNewTimeline));

});