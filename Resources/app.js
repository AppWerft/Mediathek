const Global = require('global');
const FlipModule = require('de.manumaticx.androidflip'); ! function() {

    const $ = Ti.UI.createWindow({
        fullscreen : true
    });

    $.createAndStartPlayer = function(_args) {
        var start = new Date().getTime();
        var PlayerOverlay = require('ui/audioplayer.window').createAndStartPlayer(_args);
        /* $.add(PlayerOverlay);
         PlayerOverlay.oncomplete = function() {
         try {
         $.remove(PlayerOverlay);
         PlayerOverlay = null;
         } catch(E) {
         console.log(E);
         }
         };*/
        console.log('Info: constructTime for player: ' + (new Date().getTime() - start));
    };
    $.addEventListener('open',() => {
        Global.АктйонБар.title = "DeutschlandRadio Mediathek";
        Global.АктйонБар.subtitle = Global.Stations[Global.currentStation].name;
        Global.АктйонБар.titleFont = "ScalaSansBold";
        Global.АктйонБар.backgroundColor = Global.Stations[Global.currentStation].color;
        Global.АктйонБар.subtitleColor = "#eee";

        $.activity.actionBar.displayHomeAsUp = true;
        $.activity.actionBar.onHomeIconItemSelected = function() {
            $.Drawer.toggleLeft();
        };
        $.activity.onCreateOptionsMenu = function(_menuevent) {
            _menuevent.menu.clear();
            _menuevent.menu.add({
                title : 'Start live Radio',
                itemId : 1,
                icon : '/images/playbutton.png', ///Ti.App.Android.R.drawable['ic_action_play'],
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
            }).addEventListener("click", function() {
                const station = {
                    name : Global.Stations[Global.currentStation].name,
                    color : Global.Stations[Global.currentStation].color,
                    stream : Global.Stations[Global.currentStation].stream,
                    station : Global.currentStation
                };
                require('liveradio/radioplayer.window')(station).open();
            });
        };
        var pages = [];
        for (var station in Global.Stations) {
            const opts = {
                station : station,
                window : $,
                color : Global.Stations[station].color,
                mediathek : Global.Stations[station].mediathek,
            };
            if (station != 'drw')
                pages.push(require('ui/mediathek.page')(opts));
            else
                pages.push(require('ui/nova/index.page')(opts));
        };
        $.Drawer = Ti.UI.Android.createDrawerLayout({
            leftView : require('ui/drawer/drawer.widget')(),
            centerView : FlipModule.createFlipView({
                orientation : FlipModule.ORIENTATION_HORIZONTAL,
                overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
                views : pages,
                top : 0,
                bottom : 0,
                currentPage : Global.currentPage,
                height : Ti.UI.FILL
            })
        });
        $.Drawer.centerView.addEventListener('flipped', function(e) {
            Object.keys(Global.Stations).forEach((k,i) => {
                if (i == e.index) {
                    Global.currentStation = k;
                }
            });

            Global.АктйонБар.subtitle = Global.Stations[Global.currentStation].name;
            Global.АктйонБар.backgroundColor = Global.Stations[Global.currentStation].color;
            Global.АктйонБар.subtitle = Global.Stations[Global.currentStation].name;
            Global.АктйонБар.statusbarColor = Global.Stations[Global.currentStation].darkcolor;
            Ti.App.Properties.setString('LAST_STATION', Global.currentStation);
        });
        $.Drawer.centerView.flipToView($.Drawer.centerView.views[Global.currentPage]);
       
        if (Global.currentPage < 2)
            $.Drawer.centerView.peakNext(false);
        else
            $.Drawer.centerView.peakPrevious(false);
        $.add($.Drawer);

    });
    $.open();
}();
