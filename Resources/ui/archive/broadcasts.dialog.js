const Stations = require('model/stations'),
    Animation = require("ti.scrollable.animation"),
    BroadcastsList = require('ui/archive/broadcasts.list');

module.exports = function() {
    const androidView = Ti.UI.createView({
        height : 400
    });
    androidView.add(Ti.UI.createScrollableView({
        backgroundColor : 'transparent',
        height : 400,
        views : Object.keys(Stations).map(function(stationid) {
            return BroadcastsList(Stations[stationid]);
        })
    }));
    const $ = Ti.UI.createAlertDialog({
        androidView : androidView,
        title : "Audio-Archiv",
       
        buttonNames : ["Diesen Dialog schließen"],
        cancel : 0

    });
    Animation.setAnimation(androidView.children[0], Animation.CUBE_OUT);
    $.show();
    Ti.UI.createNotification({
         message : "Senderwahl durch seitliches Wischen",
         duration: 5000
    }).show();
};
