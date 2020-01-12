const Global = require('global');
const FlipModule = require('de.manumaticx.androidflip'); ! function() {

    const $ = Ti.UI.createWindow({
       // fullscreen : true,
        navBarHidden: false,
         theme : "Theme.AppCompat.Light.DarkActionBar"
    });
    
    $.addEventListener('open',require('ui/main.menu'));
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
            leftView : require('ui/drawer/leftdrawer.widget')($),
            rightView : require('ui/drawer/rightdrawer.widget')(),
            
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
       
        const repeating = Ti.App.Properties.hasProperty("LL");
        if (Global.currentPage < 2)
            $.Drawer.centerView.peakNext(repeating);
        else
            $.Drawer.centerView.peakPrevious(repeating);
        $.add($.Drawer);
       
         Ti.App.Properties.setBool("LL",true);   
   // });
    $.open();
    $.createAndStartPlayer = function(_args) {
        require('ui/audioplayer.window').createAndStartPlayer(_args);
    };
}();
