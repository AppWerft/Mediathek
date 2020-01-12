const Permissions = require('vendor/permissions');
const Settings = require("controls/settings");
const STATUS_ONLINE = 0,
    STATUS_PROGRESS = 1,
    STATUS_SAVED = 2;
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

const TEMPLATES = ['pool_online'];
const ABX = require('com.alcoapps.actionbarextras');
const LivePlayer = require('liveradio/radioplayer.widget');
const LottieView = require("ti.animation");

module.exports = function(station) {
    const Streamer = require('liveradio/audiostreamer.adapter');
    // // START /////
    var $ = Ti.UI.createWindow({
        modal : true,
        station: station,
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
                logo : '/images/' + station.station + '.png',
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
        $.cron && clearInterval($.cron);
        stopPlayer();
        $.removeAllChildren();
        $ = null;
    });
    $.addEventListener('swipe', _e => {
        if (_e.direction == "left" || _e.direction == "right") {
            $.close();
        }
    });
    $.addEventListener('open', _e => {
        if (Settings.get("SCHLUMMER")) {

            $.add(LottieView.createAnimationView({
                file : '/images/snooze_' + station.station + '.json',
                autoStart : true,
                loop : true,
                height : 300,
                width : 300,
                zIndex : 99
            }));
            $.schlummer = true;

        }
        PlayerView = LivePlayer.createView($);
        $.cron = setInterval(PlayerView.updateView, 2000);
        PlayerView && $.add(PlayerView.getView());
        Permissions.requestPermissions(['READ_PHONE_STATE', 'RECORD_AUDIO'], onPermission);
        PlayerView && PlayerView.updateView()
    });
    return $;
};

// https://github.com/kgividen/TiCircularSliderBtnWidget
