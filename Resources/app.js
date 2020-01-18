! function() {
    const Global = require('global'),
        Aod = require('ti.aod');
    ;
    const $ = Ti.UI.createWindow({
        navBarHidden : false,
        theme : "Theme.AppCompat.Light.DarkActionBar",
        liveData : null
    });

    if (Ti.Network.online) {
        $.liveData = Aod.createPreviewdata({
            station : Global.Stations[Global.currentStation].id
        });
        $.liveData.onLoad = function(res) {
            Global.АктйонБар.subtitle = res.start + "  " + res.title;
            Global.АктйонБар.title = Global.Stations[Global.currentStation].name;
        };
    }

    $.addEventListener('open', require('ui/main.menu'));

    // livecycles:
    $.addEventListener('focus', function() {
        if ($.liveData) {
            $.liveData.start({
                interval : 10000,
            });

        }
    });
    $.addEventListener('blur', function() {
        $.liveData && $.liveData.stop();
    });

    $.Drawer = Ti.UI.Android.createDrawerLayout({
        leftView : require('ui/drawer/leftdrawer.widget')($),
        rightView : require('ui/drawer/rightdrawer.widget')($),
        bottom : 0,
        centerView : require('ui/flipview')($),
    });
    $.Drawer.addEventListener("change", $.Drawer.rightView.render);
   

    $.add($.Drawer);

    $.open();
    $.createAndStartPlayer = function(_args) {
        require('ui/audioplayer.window').createAndStartPlayer(_args);
    };
}();
