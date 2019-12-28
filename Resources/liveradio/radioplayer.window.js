const Permissions = require('vendor/permissions');
const STATUS_ONLINE = 0,
    STATUS_PROGRESS = 1,
    STATUS_SAVED = 2;
const TEMPLATES = ['pool_online'];
const ABX = require('com.alcoapps.actionbarextras');

module.exports = function(station) {
    const Streamer = require('liveradio/audiostreamer.adapter');
    // // START /////
    var $ = Ti.UI.createWindow({
        modal : true,
        backgroundColor : 'transparent',
        theme : 'Theme.AppCompat.Translucent.NoTitleBar.Fullscreen'
    });
    Streamer.init($, "applogo");
    var lastStatus = "STOPPED";
    var currentStation = null;
    var visible = true;
    var PlayerView = null;

    function stopPlayer() {
        Streamer.stop();
        //StationListModule.addTiles(PATH, $.stationList);
    }

    function playStation(station) {
        if (lastStatus == "BUFFERING") {
            return;
        }
        visible = true;
        if (lastStatus == "PLAYING")
            Streamer.stop();
        else if (lastStatus == "STOPPED") {
            Streamer.play({
                url : station.stream,
                station : station.station,
                logo : '/images/'+station.station+ '.png',
                title : station.name,
                color : station.color || 'silver',
                lifecycleContainer : $,
                icon : "applogo"
            }, function(e) {
                if (e.message && PlayerView) 
                    PlayerView.setText(e.message);
                if (lastStatus != e.status) {
                    lastStatus = e.status;
                }
            });
        }
        currentStation = station;
    }

    function onPermission(success) {
        if (success) {
            PlayerView && PlayerView.addVisualization();
            playStation(station);
        }
    }

    var started = false;

    $.addEventListener('close', function() {
        stopPlayer();
        $.removeAllChildren();
        $ = null;
    });
    $.addEventListener('open', _e => {
       // require('ti.immersivemode').hideSystemUI();
        const activity = $.activity;
        if (activity != undefined && activity.actionBar != undefined) {
            activity.onCreateOptionsMenu = _menu => {
                activity.actionBar.displayHomeAsUp = true;
                _menu.menu.add({
                title : 'Record',
                icon : Ti.App.Android.R.drawable.ic_action_record,
                showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
                }).addEventListener("click", () => {
                    alert("Hier startet bald die Möglichkeit " + station.name + " live mitzuschneiden");
                });
                activity.invalidateOptionsMenu();
                activity.actionBar.onHomeIconItemSelected = () => {
                    $.close({
                        activityEnterAnimation : Ti.Android.R.slide_in_left,
                        activityExitAnimation : Ti.Android.R.slide_out_right
                    });
                };
            };
        } else
            console.log("win has no activity");
        PlayerView = require('liveradio/radioplayer.widget').createView(station);
        PlayerView && $.add(PlayerView.getView());
        Permissions.requestPermissions(['READ_PHONE_STATE', 'RECORD_AUDIO'], onPermission);
    });
    return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
