const Global = require('global'), FlipModule = require('de.manumaticx.androidflip');

module.exports = function(window) {
    const $ = Ti.UI.createView();
    var pages = [];
    for (var station in Global.Stations) {
        const opts = {
            station : station,
            window : window,
            color : Global.Stations[station].color,
            mediathek : Global.Stations[station].mediathek,
        };
        if (station != 'drw')
            pages.push(require('ui/mediathek.page')(opts));
        else
            pages.push(require('ui/nova/index.page')(opts));
    };
    $.flipView = FlipModule.createFlipView({
        orientation : FlipModule.ORIENTATION_HORIZONTAL,
        overFlipMode : FlipModule.OVERFLIPMODE_GLOW,
        views : pages,
        top : 0,
        bottom : 0,
        currentPage : Global.currentPage,
        height : Ti.UI.FILL
    });
    $.add($.flipView);

    $.flipView.addEventListener('flipped', function(e) {
        Object.keys(Global.Stations).forEach(function(k, i) {
            if (i == e.index) {
                Global.currentStation = k;
            }
        });
        Global.АктйонБар.title = Global.Stations[Global.currentStation].name;
        Global.АктйонБар.subtitle = "  ";
        if (Global.Stations[Global.currentStation].id) {
            window.liveData.setStation(Global.Stations[Global.currentStation].id);
        }
        Global.АктйонБар.backgroundColor = Global.Stations[Global.currentStation].color;
        Global.АктйонБар.statusbarColor = Global.Stations[Global.currentStation].darkcolor;
        Ti.App.Properties.setString('LAST_STATION', Global.currentStation);
    });
    $.flipView.flipToView($.flipView.views[Global.currentPage]);
    const repeating = Ti.App.Properties.hasProperty("LL");
    if (Global.currentPage < 2)
        $.flipView.peakNext(repeating);
    else
        $.flipView.peakPrevious(repeating);

    $.archiveButton = require('ui/archive/archive.button')();
    $.add($.archiveButton);
    Ti.App.Properties.setBool("LL", true);
    return $;

};
