const Global = require('global'),
    OnlineState = require("vendor/online.state");

module.exports = function(_event) {
    Global.АктйонБар.title = "DLF Mediathek";
    Global.АктйонБар.backgroundColor = Global.Stations[Global.currentStation].color;
    Global.АктйонБар.subtitle = Global.Stations[Global.currentStation].name;
    Global.АктйонБар.statusbarColor = Global.Stations[Global.currentStation].darkcolor;
    var activity = _event.source.getActivity();
    if (activity) {
        activity.onCreateOptionsMenu = function(_menuevent) {
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
                    station : Global.currentStation,
                    id : Global.Stations[Global.currentStation].id,
                };
                require('liveradio/radioplayer.window')(station).open();
            });
        };
        activity.actionBar.onHomeIconItemSelected = function() {
            _event.source.close();
        };
        activity.actionBar.displayHomeAsUp = true;
        activity.actionBar.onHomeIconItemSelected = function() {
            _event.source.Drawer.toggleLeft();
        };
    }// if activity
    OnlineState.test(9000, function(state) {
        var dialog;
        switch (state) {
        case OnlineState.OFFLINE:
            dialog = Ti.UI.createAlertDialog({
                message : 'Keine Verbindung zur Datenautobahn',
                ok : 'Ok',
                title : 'Offline'
            });
            break;
        case OnlineState.TIMEOUT:
            dialog = Ti.UI.createAlertDialog({
                message : 'Sehr langsames Internet',
                ok : 'Ok',
                title : 'Zeitüberschreitung'
            });
            break;
        case OnlineState.CAPTIVEPORTAL:
            dialog = Ti.UI.createAlertDialog({
                message : 'Netzvwerbindung, aber keine Verbindung zum Server. Gegebenfalls müssen Sie sich einloggen',
                ok : 'Ok',
                title : 'Captive Portal'
            });
            break;
        case OnlineState.ONLINE:
            require('ti.aod').init();
            break;
        }
        if (dialog) {
            dialog.show();
            dialog.addEventListener('click', function() {
                _event.source.close();
            });
        }
    });
};
