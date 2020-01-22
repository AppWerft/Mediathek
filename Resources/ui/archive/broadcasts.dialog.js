const Stations = require('model/stations'),
    Animation = require("ti.scrollable.animation"),
    BroadcastsList = require('ui/archive/broadcasts.list');

module.exports = function() {
    var $ = Ti.UI.createWindow({
        backgroundColor : '#c000',
        activityEnterTransition:Titanium.UI.Android.TRANSITION_SLIDE_BOTTOM,
        activityReenterTransition:Titanium.UI.Android.TRANSITION_SLIDE_TOP,
        theme : 'Theme.AppCompat.Translucent.NoTitleBar'
    });
    const containerView = Ti.UI.createView({
        height : '88%',
        width : '88%'
    });
    $.add(containerView);
    containerView.add(Ti.UI.createScrollableView({
        top : 40,
        right : 15,
        left : 15,
        backgroundColor : 'transparent',

        views : Object.keys(Stations).map(function(stationid) {
            return BroadcastsList(Stations[stationid]);
        })
    }));
    if (!Ti.App.Properties.hasProperty("SWIPER")) {
        var swiperView = require('ui/swiper.widget')();
        $.add(swiperView);
        containerView.children[0].addEventListener("scrollend", function() {
            $.remove(swiperView);
            Ti.App.Properties.setString("SWIPER", "");
        });
    }
    containerView.children[0].scrollToView(containerView.children[0].views[1]);
    Animation.setAnimation(containerView.children[0], Animation.CUBE_OUT);

    containerView.add(Ti.UI.createView({
        backgroundColor : '#9fff',
        top : 5,
        right : 0,
        borderRadius : 20,
        width : 40,
        height : 40
    }));
    containerView.children[1].add(Ti.UI.createLabel({
        text : "×",
        color : '#444',
        font : {
            fontSize : 30,
            fontWeight : 'bold'
        }

    }));
    containerView.children[1].addEventListener('click', function() {
        $.removeAllChildren();
        $.close();
    });
    $.open();
};
